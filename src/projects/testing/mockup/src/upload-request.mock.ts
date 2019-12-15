import { Observable, Subject } from "rxjs";
import { UploadRequestData, UploadRequest, UploadState } from "@ngx-file-upload/core";
import { take } from "rxjs/operators";

/**
 * represents a single fileupload
 */
export class UploadRequestMock implements UploadRequest {

    destroy$: Subject<boolean>;

    destroyed: Observable<boolean>;

    public hooks = [];

    requestId;

    public data: UploadRequestData;

    change$: Subject<UploadRequestData>;

    public constructor(model: UploadRequestData) {
        this.data = model;
        this.change$ = new Subject();
        this.destroy$ = new Subject();
        this.destroyed = this.destroy$.asObservable();
    }

    isCanceled(): boolean {
        return this.data.state === UploadState.CANCELED;
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
        return this.data.state === UploadState.COMPLETED;
    }

    isIdle(): boolean {
        return this.data.state === UploadState.IDLE;
    }

    start(): void {
        this.hooks.forEach((hook) => hook.pipe(take(1)).subscribe((start) => {
            if (start) {
                this.data.state = UploadState.START;
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
        return this.data.state === UploadState.INVALID;
    }

    isPending(): boolean {
        return this.data.state === UploadState.PENDING;
    }

    isProgress(): boolean {
        return this.data.state === UploadState.PROGRESS || this.data.state === UploadState.START;
    }

    public get change(): Observable<UploadRequestData> {
        return this.change$.asObservable();
    }

    public applyChange() {
        this.change$.next({...this.data});
    }
}
