import { Observable, Subject, ReplaySubject, timer } from "rxjs";
import { buffer, takeUntil, distinctUntilKeyChanged, tap, take, auditTime, map, filter, switchMap } from "rxjs/operators";
import { UploadRequest, UploadStorageConfig, FileUpload, UploadState } from "../../api";
import { UploadQueue } from "./upload.queue";

const defaultStoreConfig: UploadStorageConfig = {
    concurrentUploads: 5,
    enableAutoStart: false
};

export class UploadStorage {

    private change$: ReplaySubject<UploadRequest[]>;
    private uploads: Map<string, UploadRequest> = new Map();
    private uploadQueue: UploadQueue;
    private storeConfig: UploadStorageConfig;
    private destroyed$: Subject<boolean> = new Subject();
    private uploadDestroy$: Subject<boolean> = new Subject();

    private uploadStateChange$: Subject<void> = new Subject();

    public constructor(config: UploadStorageConfig = null) {
        this.change$     = new ReplaySubject(1);
        this.uploadQueue = new UploadQueue();

        this.storeConfig = {...defaultStoreConfig, ...(config || {})};
        this.uploadQueue.concurrent = this.storeConfig.concurrentUploads;

        this.registerUploadStateChanged();
        this.registerUploadDestroyEvent();
    }

    /**
     * submits if any upload changes his state, uploads
     * gets removed or added
     */
    public change(): Observable<UploadRequest[]> {
        return this.change$.pipe(
            buffer(this.change$.pipe(auditTime(50))),
            map((changes: UploadRequest[][]) => changes.slice(-1)[0])
        );
    }

    /**
     * add new upload to store
     */
    public add(upload: UploadRequest | UploadRequest[]) {
        const requests = Array.isArray(upload) ? upload : [upload];

        requests.forEach((request: UploadRequest) => {
            if (request.requestId && this.uploads.has(request.requestId)) {
                return;
            }
            request.requestId = request.requestId || this.generateUniqeRequestId();
            this.uploads.set(request.requestId, request);

            this.registerUploadEvents(request);
        });

        this.afterUploadsAdd(requests);
        this.notifyObserver();
    }

    /**
     * register for changes and destroy on upload request
     */
    private registerUploadEvents(request: UploadRequest): void {

        if (!request.isInvalid()) {
            this.uploadQueue.register(request);
            this.handleRequestChange(request);
        }

        request.destroyed.pipe(
            tap(() => this.uploads.delete(request.requestId)),
            take(1)
        ).subscribe(() => this.uploadDestroy$.next());
    }

    /**
     * register to request change events, this will notify all observers
     * if state from upload state has been changed, this will not notify
     * if amount of uploaded size has been changed
     */
    private handleRequestChange(request: UploadRequest) {
        const isAutoRemove = !isNaN(this.storeConfig.removeCompleted) || false;
        request.change.pipe(
            distinctUntilKeyChanged("state"),
            /* notify observers upload state has been changed */
            tap(() => this.uploadStateChange$.next()),
            /* only continue if completed with no errors and autoremove is enabled */
            filter((upload: FileUpload) => upload.state === UploadState.COMPLETED && !upload.hasError && isAutoRemove),
            /** wait for given amount of time before we remove item */
            switchMap(() => timer(this.storeConfig.removeCompleted)),
            /* automatically unsubscribe if request gets destroyed */
            takeUntil(request.destroyed),
        )
        .subscribe(() => this.remove(request));
    }

    /**
     * uploads has been added and events are registered
     * finalize operations
     */
    private afterUploadsAdd(requests: UploadRequest[]): void {
        if (this.storeConfig.enableAutoStart) {
            requests.forEach((uploadRequest) => uploadRequest.start());
        }
    }

    /**
     * generate uniqe request id
     */
    private generateUniqeRequestId(): string {
        let reqId: string;
        do {
            reqId = Array.from({length: 4}, () => Math.random().toString(32).slice(2)).join("-");
        } while (this.uploads.has(reqId));
        return reqId;
    }

    /**
     * destroy upload storage, should never called
     * if storage is provided with InjectionToken
     */
    public destroy() {

        /** remove from all subscriptions */
        this.destroyed$.next(true);

        /** stop all downloads */
        this.stopAll();

        this.uploadQueue.destroy();

        /** destroy change stream */
        this.destroyed$.complete();
        this.change$.complete();
        this.uploadDestroy$.complete();
        this.uploadStateChange$.complete();

        this.destroyed$ = null;
        this.change$ = null;
        this.uploadDestroy$ = null;
        this.uploadStateChange$ = null;
        this.uploadQueue = null;
        this.uploads = null;
    }

    /**
     * remove upload from store
     */
    public remove(upload: UploadRequest | string) {
        const id = typeof(upload) === "string" ? upload : upload.requestId;
        const request = this.uploads.get(id);
        request.destroy();
    }

    /**
     * remove all uploads which has been invalid
     * canceled or upload has been completed even it is has an error
     */
    public purge() {
        this.uploads.forEach((upload) => {
            if (upload.isCompleted() || upload.isInvalid()) {
                upload.destroy();
            }
        });
    }

    /**
     * starts all queued uploads
     */
    public startAll() {
        this.uploads.forEach((upload) => {
            if (upload.isIdle()) {
                upload.start();
            }
        });
    }

    /**
     * stops all active uploads
     */
    public stopAll() {
        this.uploads.forEach(upload => upload.destroy());
    }

    /**
     * remove invalidated uploads
     */
    public removeInvalid() {
        this.uploads.forEach((upload) => {
            if (upload.isInvalid()) {
                upload.destroy();
            }
        });
        this.notifyObserver();
    }

    /**
     * upload state has been changed from
     * idle to pending
     */
    private registerUploadStateChanged() {
        this.uploadStateChange$
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => this.notifyObserver()
            });
    }

    /**
     * registers to uploads destroy event, since multiple uploads
     * can destroyed in short amount of time we buffer them at least for 10ms.
     * and then remove them from list and notify observer
     */
    private registerUploadDestroyEvent() {
        this.uploadDestroy$
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => this.notifyObserver()
            });
    }

    /**
     * notify observer store data has been changed
     */
    private notifyObserver() {
        this.change$.next(Array.from(this.uploads.values()));
    }
}
