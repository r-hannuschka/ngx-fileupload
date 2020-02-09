import { Observable, Subject } from "rxjs";
import { NgxFileUploadRequestData, NgxFileUploadRequest, NgxFileUploadState } from "@ngx-file-upload/core";
import { take } from "rxjs/operators";

/**
 * represents a single fileupload
 */
export class UploadRequestMock implements NgxFileUploadRequest {

    destroy$: Subject<boolean>;

    destroyed: Observable<boolean>;

    public hooks = [];

    requestId;

    public data: NgxFileUploadRequestData;

    change$: Subject<NgxFileUploadRequestData>;

    public constructor(model: NgxFileUploadRequestData) {
        this.data = model;
        this.change$ = new Subject();
        this.destroy$ = new Subject();
        this.destroyed = this.destroy$.asObservable();
    }

    isCanceled(): boolean {
        return this.data.state === NgxFileUploadState.CANCELED;
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
        return this.data.state === NgxFileUploadState.COMPLETED;
    }

    isIdle(): boolean {
        return this.data.state === NgxFileUploadState.IDLE;
    }

    start(): void {
        this.hooks.forEach((hook) => hook.pipe(take(1)).subscribe((start) => {
            if (start) {
                this.data.state = NgxFileUploadState.START;
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
        return this.data.state === NgxFileUploadState.INVALID;
    }

    isPending(): boolean {
        return this.data.state === NgxFileUploadState.PENDING;
    }

    isProgress(): boolean {
        return this.data.state === NgxFileUploadState.PROGRESS || this.data.state === NgxFileUploadState.START;
    }

    public get change(): Observable<NgxFileUploadRequestData> {
        return this.change$.asObservable();
    }

    public applyChange() {
        this.change$.next({...this.data});
    }
}
