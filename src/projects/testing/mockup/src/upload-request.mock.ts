import { Observable, Subject } from "rxjs";
import { INgxFileUploadRequest, INgxFileUploadRequestModel, NgxFileUploadState } from "@ngx-file-upload/core";
import { take } from "rxjs/operators";
import { INgxFileUploadRequestData } from "@ngx-file-upload/dev/core/public-api";

/**
 * represents a single fileupload
 */
export class UploadRequestMock implements INgxFileUploadRequest {

    destroy$: Subject<boolean>;

    destroyed: Observable<boolean>;

    public hooks: Observable<boolean>[] = [];

    requestId: string = "";

    data: INgxFileUploadRequestData;

    change$: Subject<INgxFileUploadRequestData>;

    public constructor(model: INgxFileUploadRequestModel) {
        this.data = model;
        this.change$ = new Subject();
        this.destroy$ = new Subject();
        this.destroyed = this.destroy$.asObservable();
    }

    set state(state: NgxFileUploadState) {
        this.data.state = state;
    }

    get state(): NgxFileUploadState {
        return this.data.state;
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

    public get change(): Observable<INgxFileUploadRequestData> {
        return this.change$.asObservable();
    }

    public applyChange() {
        this.change$.next(this.data)
    }
}
