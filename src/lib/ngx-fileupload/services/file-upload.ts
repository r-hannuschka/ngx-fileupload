import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpParams } from '@angular/common/http';
import { FileModel, FileState } from '../model/file';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

export interface UploadOptions {
    url: string;
    params?: HttpParams;
}

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
    private upload$: BehaviorSubject<FileModel>;

    /**
     * flag upload is canceled, so we know if request gets completed
     * of canceled
     */
    private isCanceled = false;

    /**
     * create FileUpload service
     */
    public constructor(
        private http: HttpClient,
        private fileModel: FileModel,
        private url: string
    ) {
        this.upload$ = new BehaviorSubject(this.fileModel);
    }

    /**
     * upload file to server but only
     * if file is not queued, abort request on cancel
     */
    public start() {
        if (this.file.state === FileState.QUEUED) {
            this.uploadFile().pipe(
                takeUntil(this.cancel$),
                tap({
                    next: (event: HttpEvent<string>) => this.handleHttpEvent(event)
                })
            )
            .subscribe({
                complete: () => this.handleUploadCompleted()
            });
        }
    }

    /**
     * cancel current file upload, this will complete change subject
     */
    public cancel() {
        let isCancelAble = this.file.state !== FileState.CANCELED;
        isCancelAble = isCancelAble && this.file.state !== FileState.UPLOADED;

        if (isCancelAble) {
            this.isCanceled = true;
            this.cancel$.next(true);
        }
    }

    /**
     * returns observable which notify if file upload state
     * has been changed
     */
    public get change(): Observable<FileModel> {
        return this.upload$.asObservable();
    }

    /**
     * get file which should uploaded
     */
    public get file(): FileModel {
        return this.fileModel;
    }

    /**
     * build form data and send request to server
     */
    private uploadFile(): Observable<HttpEvent<string>> {

        const formData = new FormData();
        formData.append('file', this.file.blob, this.file.fileName);

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
        }
    }

    /**
     * handle file upload in progress
     */
    private handleProgress(event: HttpProgressEvent) {
        this.file.state = FileState.PROGRESS;
        this.file.uploaded = event.loaded;
        this.notifyObservers();
    }

    /**
     * upload has been started
     */
    private handleSent() {
        this.file.state = FileState.START;
        this.notifyObservers();
    }

    /**
     * upload has been completed
     */
    private handleUploadCompleted() {
        this.file.state = this.isCanceled ? FileState.CANCELED : FileState.UPLOADED;
        this.notifyObservers();

        this.upload$.complete();
        this.cancel$.complete();
        this.cancel$ = null;
    }

    /**
     * send notification to observers
     */
    private notifyObservers() {
        this.upload$.next(this.file);
    }
}
