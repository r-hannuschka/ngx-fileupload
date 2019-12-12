import { Observable, Subject } from "rxjs";
import { FileUpload, UploadRequest, UploadState } from "projects/ngx-fileupload/public-api";
import { take } from "rxjs/operators";

/**
 * represents a single fileupload
 */
export class UploadRequestMock implements UploadRequest {

    destroy$: Subject<boolean>;

    destroyed: Observable<boolean>;

    public hooks = [];

    requestId;

    public uploadFile: FileUpload;

    change$: Subject<FileUpload>;

    public constructor(model: FileUpload) {
        this.uploadFile = model;
        this.change$ = new Subject();
        this.destroy$ = new Subject();
        this.destroyed = this.destroy$.asObservable();
    }

    isCanceled(): boolean {
        return this.uploadFile.state === UploadState.CANCELED;
    }

    retry(): void {
    }

    beforeStart(hook: Observable<boolean>): void {
        this.hooks.push(hook);
    }

    destroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.change$.complete();
    }

    isCompleted(): boolean {
        return this.uploadFile.state === UploadState.COMPLETED;
    }

    isIdle(): boolean {
        return this.uploadFile.state === UploadState.IDLE;
    }

    start(): void {
        this.hooks.forEach((hook) => hook.pipe(take(1)).subscribe((start) => {
            if (start) {
                this.uploadFile.state = UploadState.START;
                this.applyChange();
            }
        }));
    }

    cancel(): void {
    }

    hasError(): boolean {
        return false;
    }

    isInvalid(): boolean {
        return this.uploadFile.state === UploadState.INVALID;
    }

    isPending(): boolean {
        return this.uploadFile.state === UploadState.PENDING;
    }

    isProgress(): boolean {
        return this.uploadFile.state === UploadState.PROGRESS || this.uploadFile.state === UploadState.START;
    }

    public get change(): Observable<FileUpload> {
        return this.change$.asObservable();
    }

    public applyChange() {
        this.change$.next({...this.uploadFile});
    }
}
