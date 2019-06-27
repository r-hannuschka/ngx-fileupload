import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { FileModel, UploadState } from '../model/file';

export interface FileData {
    state: UploadState;
    uploaded: number;
    size: number;
    name: string;
    progress: number;
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
        if (this.file.state === UploadState.QUEUED) {
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
        let isCancelAble = this.file.state !== UploadState.CANCELED;
        isCancelAble = isCancelAble && this.file.state !== UploadState.UPLOADED;

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
     * return file upload data
     * @todo move to model
     */
    public toJson(): FileData {

        const progress = this.file.uploaded * 100 / this.file.fileSize;

        return {
            state    : this.file.state,
            uploaded : this.file.uploaded,
            size     : this.file.fileSize,
            name     : this.file.fileName,
            progress : Math.round(progress > 100 ? 100 : progress)
        };
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
        this.file.state = UploadState.PROGRESS;
        this.file.uploaded = event.loaded;
        this.notifyObservers();
    }

    /**
     * upload has been started
     */
    private handleSent() {
        this.file.state = UploadState.START;
        this.notifyObservers();
    }

    /**
     * upload has been completed
     */
    private handleUploadCompleted() {
        this.file.state = this.isCanceled ? UploadState.CANCELED : UploadState.UPLOADED;
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
