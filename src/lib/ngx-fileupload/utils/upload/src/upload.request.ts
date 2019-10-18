import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { takeUntil, filter } from "rxjs/operators";
import { UploadState, UploadResponse, UploadData, Upload, Validator, ValidationFn} from "../../../data/api";
import { UploadModel } from "../../../data/upload.model";

/**
 * Upload Options
 */
export interface UploadOptions {

    /**
     * url which should used to upload file
     */
    url: string;

    /**
     * form data options
     */
    formData?: {

        /**
         * if set to false, file will send through post body and not wrapped in
         * FormData Object
         */
        enabled: boolean;
        /**
         * only used if FormData is enabled, defines the name which should used
         * in FormData
         */
        name?: string;
    };
}

/**
 * represents a single file upload
 */
export class UploadRequest implements Upload {

    /**
     * if cancel$ emits true, current upload will stopped
     */
    private cancel$: Subject<boolean> = new Subject();

    private complete$: Subject<boolean> = new Subject();

    /**
     * upload stream to notify observers if something has been changed
     */
    private upload$: BehaviorSubject<UploadModel>;

    private options: UploadOptions = {
        url: "",
        formData: { enabled: true, name: "file" }
    };

    /**
     * create UploadRequest service
     */
    public constructor(
        private http: HttpClient,
        private upload: UploadModel,
        options: UploadOptions
    ) {
        this.upload$ = new BehaviorSubject(this.upload);
        this.options = {...this.options, ...options};
    }

    public validate(validator: Validator | ValidationFn) {
        const result = "validate" in validator
            ? validator.validate(this.upload.file)
            : validator(this.upload.file);

        this.upload.invalid = false;

        if (result !== null) {
            this.upload.state = UploadState.INVALID;
            this.upload.invalid = true;
        }
        this.upload.validationErrors = result;
    }

    /**
     * upload file to server but only
     * if file is not queued, abort request on cancel
     */
    public start() {
        /** only start upload if state is not queued and is valid */
        if (this.upload.state === UploadState.QUEUED) {
            this.uploadFile().pipe(
                takeUntil(this.cancel$),
                filter(() => this.upload.state !== UploadState.CANCELED)
            )
            .subscribe({
                next: (event: HttpEvent<string>) => this.handleHttpEvent(event),
                error: (error: HttpErrorResponse) => this.handleError(error)
            });
        }
    }

    public destroy() {
        this.upload$.complete();
        this.upload$ = null;
    }

    /**
     * restart download again
     * reset state, and reset errors
     */
    public retry() {
        if (this.upload.state === UploadState.ERROR) {
            this.upload.state = UploadState.QUEUED;
            this.upload.response = {success: false, body: null, errors: null};
            this.start();
        }
    }

    /**
     * cancel current file upload, this will complete change subject
     */
    public cancel() {
        if (this.upload.state !== UploadState.CANCELED) {
            this.upload.state = UploadState.CANCELED;
            this.cancel$.next(true);
            this.completeUpload();
        }
    }

    /**
     * returns observable which notify if file upload state
     * has been changed
     */
    public get change(): Observable<UploadModel> {
        return this.upload$.asObservable();
    }

    public get complete(): Observable<boolean> {
        return this.complete$.asObservable();
    }

    public get model(): UploadModel {
        return this.upload;
    }

    public get data(): UploadData {
        return this.upload.toJson();
    }

    public get state() {
        return this.model.state;
    }

    /**
     * return true if upload was not completed since the server
     * sends back an error response
     */
    public hasError(): boolean {
        return this.upload.state === UploadState.ERROR;
    }

    /**
     * returns true if validators are set and upload not validated
     */
    public isInvalid(): boolean {
        return this.upload.state === UploadState.INVALID;
    }

    public isCompleted(): boolean {
        return this.upload.state === UploadState.UPLOADED || this.upload.state === UploadState.CANCELED;
    }

    public isRequestCompleted() {
        return this.upload.state === UploadState.UPLOADED || this.upload.state === UploadState.ERROR;
    }

    /**
     * build form data and send request to server
     */
    private uploadFile(): Observable<HttpEvent<string>> {
        const uploadBody = this.createUploadBody();
        return this.http.post<string>(this.options.url, uploadBody, {
            reportProgress: true,
            observe: "events"
        });
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
     * handle all http events
     */
    private handleHttpEvent(event: HttpEvent<string>) {
        switch (event.type) {
            case HttpEventType.Sent: this.handleSent(); break;
            case HttpEventType.UploadProgress: this.handleProgress(event); break;
            case HttpEventType.Response: this.handleResponse(event); break;
        }
    }

    /**
     * upload has been started
     */
    private handleSent() {
        this.upload.state = UploadState.START;
        this.notifyObservers();
    }

    /**
     * handle file upload in progress
     */
    private handleProgress(event: HttpProgressEvent) {
        this.upload.state = UploadState.PROGRESS;
        this.upload.uploaded = event.loaded;
        this.notifyObservers();
    }

    /**
     * upload has been completed so server responds within 200 range
     * status code
     */
    private handleResponse(res: HttpResponse<any>) {
        const uploadResponse: UploadResponse = {
            success: res.ok,
            body: res.body,
            errors: null
        };
        this.upload.response = uploadResponse;
        this.upload.state    = UploadState.REQUEST_COMPLETED;
        this.notifyObservers();
    }

    /**
     * if server not sends a status code in 2xx range this will
     * throw an error which will handled here
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
        this.upload.state    = UploadState.REQUEST_COMPLETED;
        this.upload.response = uploadResponse;
        this.notifyObservers();
    }

    /**
     * emit upload has been completed
     */
    private completeUpload() {
        this.notifyObservers();
        this.complete$.next(true);

        this.cancel$.complete();
        this.complete$.complete();
    }

    /**
     * send notification to observers
     */
    private notifyObservers() {
        this.upload$.next(this.upload);
    }
}
