import { Observable, Subject } from "rxjs";
import { FileUpload, UploadRequest, UploadState } from "@r-hannuschka/ngx-fileupload";

/**
 * represents a single fileupload
 */
export class UploadRequestMock implements UploadRequest {

    destroy$: Subject<boolean>;

    destroyed: Observable<boolean>;

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
        return false;
    }

    retry(): void {
    }

    beforeStart(hook: Observable<boolean>): void {
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
        this.change$.next(this.uploadFile);
    }
}
