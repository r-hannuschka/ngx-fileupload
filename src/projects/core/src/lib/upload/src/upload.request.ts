import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Subject, Observable, merge, of, concat } from "rxjs";
import { takeUntil, filter, switchMap, map, tap, bufferCount } from "rxjs/operators";
import { UploadState, UploadResponse, UploadRequest, UploadOptions, UploadRequestData} from "../../api";
import { UploadModel } from "./upload.model";

/**
 * represents a single file upload
 */
export class Upload implements UploadRequest {

    private cancel$: Subject<boolean> = new Subject();
    private change$: Subject<UploadRequestData> = new Subject();
    private destroyed$: Subject<boolean> = new Subject();

    private options: UploadOptions = {
        url: "",
        formData: { enabled: true, name: "file" }
    };

    private hooks: {beforeStart: Observable<boolean>[]} = { beforeStart: [] };

    public get change(): Observable<UploadRequestData> {
        return this.change$.asObservable();
    }

    public get destroyed(): Observable<boolean> {
        return this.destroyed$.asObservable();
    }

    public get data(): UploadRequestData {
        return this.upload;
    }

    public requestId: string;

    /**
     * create UploadRequest service
     */
    public constructor(
        private http: HttpClient,
        private upload: UploadRequestData,
        options: UploadOptions
    ) {
        this.options = {...this.options, ...options};
    }

    public beforeStart(hook: Observable<boolean>) {
        this.hooks.beforeStart = [
            ...this.hooks.beforeStart,
            hook
        ];
    }

    /**
     * cancel current file upload, this will complete change subject
     */
    public cancel() {
        if (this.isProgress() || this.isPending()) {
            this.upload.state = UploadState.CANCELED;
            this.notifyObservers();
            this.cancel$.next(true);
        }
    }

    public destroy() {

        this.finalizeUpload();
        this.destroyed$.next(true);
        this.destroyed$.complete();

        this.destroyed$ = null;
        this.hooks      = null;
        this.upload     = null;
        this.cancel$    = null;
        this.change$    = null;
    }

    /**
     * return true if upload was not completed since the server
     * sends back an error response
     */
    public hasError(): boolean {
        return this.upload.state === UploadState.COMPLETED && !this.upload.response.success;
    }

    public isCompleted(ignoreError = false): boolean {
        let isCompleted = this.isRequestCompleted();
        isCompleted = isCompleted && (ignoreError || !this.hasError());
        isCompleted = isCompleted || this.upload.state === UploadState.CANCELED;
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
            this.upload = new UploadModel(this.upload.raw);
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

        this.beforeStartHook$.pipe(
            filter(isAllowedToStart => isAllowedToStart),
            tap(() => (this.upload.state = UploadState.START, this.notifyObservers())),
            switchMap(() => this.startUploadRequest()),
        ).subscribe({
            next:  (event: HttpEvent<string>) => this.handleHttpEvent(event),
            error: (error: HttpErrorResponse) => this.handleError(error)
        });
    }

    /**
     * call hooks in order, see playground
     *
     * @see https://rxviz.com/v/58GkkYv8
     */
    private get beforeStartHook$(): Observable<boolean> {

        const initialState = this.upload.state;

        let hook$: Observable<boolean> = of(true);

        if (this.hooks.beforeStart.length) {
            hook$ = concat(...this.hooks.beforeStart)
            .pipe(
                bufferCount(this.hooks.beforeStart.length),
                map((result) => result.every(isAllowed => isAllowed)),
                tap(() => this.upload.state !== initialState ? this.notifyObservers() : void 0)
            );
        }
        return hook$;
    }

    /**
     * build form data and send request to server
     */
    private startUploadRequest(): Observable<HttpEvent<string>> {
        const uploadBody = this.createUploadBody();
        return this.http.post<string>(this.options.url, uploadBody, {
            reportProgress: true,
            observe: "events"
        }).pipe(
            takeUntil(merge(this.cancel$, this.destroyed$)),
        );
    }

    /**
     * create upload body which will should be send
     */
    private createUploadBody(): FormData | File {
        if (this.options.formData.enabled) {
            const formData = new FormData();
            const label    = this.options.formData.name;
            formData.append(label, this.upload.raw, this.upload.name);
            return formData;
        }
        return this.upload.raw;
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

        this.upload.state    = UploadState.COMPLETED;
        this.upload.response = uploadResponse;
        this.upload.hasError = true;
        this.notifyObservers();
    }

    /**
     * handle all http events
     */
    private handleHttpEvent(event: HttpEvent<string>) {
        switch (event.type) {
            case HttpEventType.UploadProgress: this.handleProgress(event); break;
            case HttpEventType.Response:       this.handleResponse(event); break;
        }
    }

    /**
     * handle http progress event
     */
    private handleProgress(event: HttpProgressEvent) {

        const loaded   = event.loaded;
        const progress = loaded * 100 / this.upload.size;

        this.upload.state = UploadState.PROGRESS;
        this.upload.uploaded = loaded;
        this.upload.progress = Math.min(Math.round(progress), 100);

        this.notifyObservers();
    }

    /**
     * upload completed with an success
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
        this.finalizeUpload();
    }

    /**
     * send notification to observers
     */
    private notifyObservers() {
        this.change$.next({...this.upload});
    }

    /**
     * upload has been completed, canceled or destroyed
     */
    private finalizeUpload() {
        this.change$.complete();
        this.cancel$.complete();
    }
}
