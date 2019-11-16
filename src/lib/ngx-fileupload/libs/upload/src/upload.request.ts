import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Subject, Observable, forkJoin, merge } from "rxjs";
import { takeUntil, filter, switchMap, map } from "rxjs/operators";
import { UploadState, UploadResponse, UploadData, Upload, UploadFile, UploadOptions} from "../../api";

/**
 * represents a single file upload
 */
export class UploadRequest implements Upload {

    /**
     * if cancel$ emits true, current upload will stopped
     */
    private cancel$: Subject<boolean> = new Subject();

    /**
     * upload stream to notify observers if something has been changed
     */
    private upload$: Subject<UploadData>;

    /**
     * upload stream gets destroyed
     */
    private destroyed$: Subject<boolean> = new Subject();

    private options: UploadOptions = {
        url: "",
        formData: { enabled: true, name: "file" }
    };

    private hooks: {beforeStart: Array<() => Observable<boolean>>} = { beforeStart: [] };

    public get change(): Observable<UploadData> {
        return this.upload$.asObservable();
    }

    public get destroyed(): Observable<boolean> {
        return this.destroyed$.asObservable();
    }

    public get data(): UploadData {
        return {
            name: this.upload.fileName,
            isPending: this.upload.state === UploadState.PENDING,
            isInvalid: this.upload.state === UploadState.INVALID,
            progress: this.upload.progress,
            requestId: this.requestId,
            size: this.upload.fileSize,
            state: this.upload.state,
            response: this.upload.response,
            uploaded: this.upload.uploaded,
            validation: {
                errors: this.upload.validationErrors
            },
            hasError: this.upload.state === UploadState.COMPLETED && !this.upload.response.success
        };
    }

    public set state(state: UploadState) {
        this.upload.state = state;
    }

    public get state() {
        return this.upload.state;
    }

    private uploadRequestId: string;

    public get requestId(): string {
        return this.uploadRequestId;
    }

    /**
     * create UploadRequest service
     */
    public constructor(
        private http: HttpClient,
        private upload: UploadFile,
        options: UploadOptions
    ) {
        this.uploadRequestId = Array.from({length: 4}, () => Math.random().toString(32).slice(2)).join("-");
        this.upload$ = new Subject();
        this.options = {...this.options, ...options};
    }

    public beforeStart(hook: () => Observable<boolean>) {
        this.hooks.beforeStart = [
            ...this.hooks.beforeStart,
            hook
        ];
    }

    public update() {
        this.notifyObservers();
    }

    /**
     * cancel current file upload, this will complete change subject
     */
    public cancel() {
        if (!this.isCompleted(true) && this.upload.state !== UploadState.INVALID) {
            this.upload.state = UploadState.CANCELED;
            this.cancel$.next(true);
            this.notifyObservers();
        }
    }

    public destroy() {
        this.destroyed$.next(true);

        this.destroyed$.complete();
        this.cancel$.complete();
        this.upload$.complete();

        this.destroyed$ = null;
        this.hooks      = null;
        this.upload$    = null;
        this.upload     = null;
        this.cancel$    = null;
    }

    public isCompleted(ignoreError = false): boolean {
        let isCompleted = this.isRequestCompleted();
        isCompleted = isCompleted && (ignoreError || !this.hasError());
        isCompleted = isCompleted || this.state === UploadState.CANCELED;
        return isCompleted;
    }

    public isCanceled(): boolean {
        return this.upload.state === UploadState.CANCELED;
    }

    public isInvalid(): boolean {
        return this.upload.state === UploadState.INVALID;
    }

    public isProgress(): boolean {
        return this.upload.state === UploadState.PROGRESS || this.upload.state === UploadState.START;
    }

    public isPending(): boolean {
        return this.upload.state === UploadState.PENDING;
    }

    public isIdle(): boolean {
        return this.upload.state === UploadState.IDLE;
    }

    /** returns true if request has been completed even on error */
    public isRequestCompleted() {
        return this.upload.state === UploadState.COMPLETED;
    }

    /**
     * restart download again
     * reset state, and reset errors
     */
    public retry() {
        if (this.isRequestCompleted() && this.hasError() || this.isCanceled()) {
            this.resetUpload();
            this.start();
        }
    }

    /**
     * start file upload
     */
    public start() {

        if (!this.isIdle() && !this.isPending()) {
            return;
        }

        /** call beforeStart hooks, if one returns false upload will not started
         * rework to concat since we can go out if anything break
         * so it have not loop through all observables if anything break and we have a
         * chain we can control a bit by position of hook
         */
        forkJoin(this.hooks.beforeStart.map((hook) => hook()))
            .pipe(
                map((result: boolean[]) => result.reduce((prev, cur) => prev && cur, true)),
                filter(result => result),
                switchMap(() => this.uploadFile()),
            )
            .subscribe({
                next:  (event: HttpEvent<string>) => this.handleHttpEvent(event),
                error: (error: HttpErrorResponse) => this.handleError(error)
            });
    }

    /**
     * return true if upload was not completed since the server
     * sends back an error response
     */
    public hasError(): boolean {
        return this.upload.hasError;
    }

    /**
     * build form data and send request to server
     */
    private uploadFile(): Observable<HttpEvent<string>> {
        const uploadBody = this.createUploadBody();
        return this.http.post<string>(this.options.url, uploadBody, {
            reportProgress: true,
            observe: "events"
        }).pipe(takeUntil(merge(this.cancel$, this.destroyed$)));
    }

    /**
     * create upload body which will should be send
     */
    private createUploadBody(): FormData | File {
        if (this.options.formData.enabled) {
            const formData = new FormData();
            const label    = this.options.formData.name;
            formData.append(label, this.upload.file, this.upload.fileName);
            return formData;
        }
        return this.upload.file;
    }

    /**
     * request responds with an error
     */
    private handleError(response: HttpErrorResponse) {

        let errors: any[] = response.error instanceof ProgressEvent || response.status === 404 ? response.message : response.error;
        errors = Array.isArray(errors) ? errors : [errors];

        const uploadResponse: UploadResponse = {
            success: false,
            body: null,
            errors
        };

        /** not completed since we could retry */
        this.upload.state    = UploadState.COMPLETED;
        this.upload.response = uploadResponse;
        this.notifyObservers();
    }

    /**
     * handle all http events
     */
    private handleHttpEvent(event: HttpEvent<string>) {
        switch (event.type) {
            case HttpEventType.Sent:           this.handleSent(); break;
            case HttpEventType.UploadProgress: this.handleProgress(event); break;
            case HttpEventType.Response:       this.handleResponse(event); break;
        }
    }

    /**
     * handle http progress event
     */
    private handleProgress(event: HttpProgressEvent) {

        const loaded   = event.loaded;
        const progress = loaded * 100 / this.upload.fileSize;

        this.upload.state = UploadState.PROGRESS;
        this.upload.uploaded = loaded;
        this.upload.progress = Math.min(Math.round(progress), 100);

        this.notifyObservers();
    }

    /**
     * upload completed with 20x
     */
    private handleResponse(res: HttpResponse<any>) {
        const uploadResponse: UploadResponse = {
            success: res.ok,
            body: res.body,
            errors: null
        };
        this.upload.response = uploadResponse;
        this.upload.state    = UploadState.COMPLETED;
        this.notifyObservers();
    }

    /**
     * upload has been started
     */
    private handleSent() {
        this.upload.state = UploadState.START;
        this.notifyObservers();
    }

    /**
     * send notification to observers
     */
    private notifyObservers() {
        this.upload$.next(this.data);
    }

    /**
     * reset upload
     */
    private resetUpload() {
        this.upload.state     = UploadState.IDLE;
        this.upload.response  = {success: false, body: null, errors: null};
        this.upload.uploaded  = 0;
    }
}
