import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UploadModel, UploadState} from '../model/upload';

/**
 * represents a single fileupload
 */
export class FileUpload {

    /**
     * if cancel$ emits true, current upload will stopped
     */
    private cancel$: Subject<boolean> = new Subject();

    /**
     * upload stream to notify observers if something has been changed
     */
    private upload$: BehaviorSubject<UploadModel>;

    /**
     * create FileUpload service
     */
    public constructor(
        private http: HttpClient,
        private upload: UploadModel,
        private url: string
    ) {
        this.upload$ = new BehaviorSubject(this.upload);
    }

    /**
     * upload file to server but only
     * if file is not queued, abort request on cancel
     */
    public start() {
        /** only start upload if state is not queued */
        if (this.upload.state === UploadState.QUEUED) {
            this.uploadFile().pipe(
                takeUntil(this.cancel$),
                filter(() => this.upload.state !== UploadState.CANCELED)
            )
            .subscribe({
                next: (event: HttpEvent<string>) => this.handleHttpEvent(event),
                error: (error: HttpErrorResponse) => this.handleHttpError(error)
            });
        }
    }

    /**
     * cancel current file upload, this will complete change subject
     */
    public cancel() {
        let isCancelAble = this.upload.state !== UploadState.CANCELED;
        isCancelAble     = isCancelAble && this.upload.state !== UploadState.UPLOADED;

        if (isCancelAble) {
            this.upload.state = UploadState.CANCELED;
            this.notifyObservers();
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

    /**
     * build form data and send request to server
     */
    private uploadFile(): Observable<HttpEvent<string>> {
        const formData = new FormData();
        formData.append('file', this.upload.blob, this.upload.fileName);
        return this.http.post<string>(this.url, formData, {
            reportProgress: true,
            observe: 'events'
        });
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

    private handleHttpError(error: HttpErrorResponse) {
        console.log(error);
        this.upload.state = UploadState.ERROR;
        this.upload.error = error.message;
        this.notifyObservers();
        this.completeUpload();
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
     * upload has been started
     */
    private handleSent() {
        this.upload.state = UploadState.START;
        this.notifyObservers();
    }

    /**
     * upload has been completed
     */
    private handleResponse(res: HttpResponse<any>) {
        this.upload.state = UploadState.UPLOADED;
        console.log(this.upload.state);
        this.notifyObservers();
        this.completeUpload();
    }

    /**
     * complete download, complete streams and delete them
     * notify observers
     */
    private completeUpload() {
        this.upload$.complete();
        this.cancel$.complete();
        this.cancel$ = null;
        this.upload$ = null;
    }

    /**
     * send notification to observers
     */
    private notifyObservers() {
        this.upload$.next(this.upload);
    }
}
