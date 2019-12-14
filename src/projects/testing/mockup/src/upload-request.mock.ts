import { Observable, Subject } from "rxjs";
import { FileUpload, UploadRequest, UploadState } from "@ngx-file-upload/core";
import { take } from "rxjs/operators";

/**
 * represents a single fileupload
 */
export class UploadRequestMock implements UploadRequest {

    destroy$: Subject<boolean>;

    destroyed: Observable<boolean>;

    public hooks = [];

    requestId;

    public file: FileUpload;

    change$: Subject<FileUpload>;

    public constructor(model: FileUpload) {
        this.file = model;
        this.change$ = new Subject();
        this.destroy$ = new Subject();
        this.destroyed = this.destroy$.asObservable();
    }

    isCanceled(): boolean {
        return this.file.state === UploadState.CANCELED;
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
        return this.file.state === UploadState.COMPLETED;
    }

    isIdle(): boolean {
        return this.file.state === UploadState.IDLE;
    }

    start(): void {
        this.hooks.forEach((hook) => hook.pipe(take(1)).subscribe((start) => {
            if (start) {
                this.file.state = UploadState.START;
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
        return this.file.state === UploadState.INVALID;
    }

    isPending(): boolean {
        return this.file.state === UploadState.PENDING;
    }

    isProgress(): boolean {
        return this.file.state === UploadState.PROGRESS || this.file.state === UploadState.START;
    }

    public get change(): Observable<FileUpload> {
        return this.change$.asObservable();
    }

    public applyChange() {
        this.change$.next({...this.file});
    }
}
