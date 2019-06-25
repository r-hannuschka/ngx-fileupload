import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { FileModel, FileState } from '../model/file';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

/**
 * represents a single file upload
 * notfiy on upload state changed
 */
export class FileUpload {

    private cancel$: Subject<boolean> = new Subject();

    private upload$: BehaviorSubject<FileModel>;

    private isCanceled = false;

    public constructor(
        private http: HttpClient,
        private fileModel: FileModel
    ) {
        this.upload$ = new BehaviorSubject(this.fileModel);
    }

    /**
     * upload file to server but only
     * if file is not queued, abort request on cancel
     */
    public start(url: string) {
        if (this.file.state === FileState.QUEUED) {
            this.uploadFile(url).pipe(
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
     * cancel current file upload
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
     * returns allways the current state from upload
     */
    public get change(): Observable<any> {
        return this.upload$.asObservable();
    }

    public get file(): FileModel {
        return this.fileModel;
    }

    /**
     * build form data and send request to server
     */
    private uploadFile(url: string) {
        const formData = new FormData();
        formData.append('file', this.file.blob, this.file.fileName);

        return this.http.post<string>(url, formData, {
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
