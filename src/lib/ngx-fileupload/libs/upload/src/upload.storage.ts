import { Observable, Subject, ReplaySubject } from "rxjs";
import { buffer, debounceTime, takeUntil, distinctUntilKeyChanged, tap, take } from "rxjs/operators";
import { UploadQueue } from "./upload.queue";
import { UploadRequest } from "../../api";

export interface UploadStorageConfig {
    concurrentUploads?: number;

    autoStart?: boolean;

    /** not implemented yet */
    removeCompletedUploads?: boolean;
}

const defaultStoreConfig: UploadStorageConfig = {
    concurrentUploads: 5,
    autoStart: false
};

export class UploadStorage {

    private change$: ReplaySubject<UploadRequest[]>;
    private uploads: Map<string, UploadRequest> = new Map();
    private uploadQueue: UploadQueue;
    private storeConfig: UploadStorageConfig;
    private destroyed$: Subject<boolean> = new Subject();
    private uploadDestroy$: Subject<boolean> = new Subject();

    private uploadStateChange$: Subject<void> = new Subject();

    public constructor(config: UploadStorageConfig = {}) {
        this.change$     = new ReplaySubject(1);
        this.uploadQueue = new UploadQueue();

        this.storeConfig = {...defaultStoreConfig, ...config};
        this.uploadQueue.concurrent = this.storeConfig.concurrentUploads;

        this.registerUploadStateChanged();
        this.registerUploadDestroyEvent();
    }

    /**
     * submits if any upload changes his state, uploads
     * gets removed or added
     */
    public change(): Observable<UploadRequest[]> {
        return this.change$.asObservable();
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

            /** only register for changes if request is not invalid */
            if (!request.isInvalid()) {
                this.uploadQueue.register(request);
                request.change.pipe(
                    distinctUntilKeyChanged("state"),
                    takeUntil(request.destroyed),
                )
                .subscribe(() => this.uploadStateChange$.next());
            }

            request.destroyed.pipe(
                tap(() => this.uploads.delete(request.requestId)),
                take(1)
            ).subscribe(() => this.uploadDestroy$.next());
        });

        this.notifyObserver();
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
        this.uploadStateChange$.pipe(
            buffer(this.uploadStateChange$.pipe(debounceTime(10))),
            takeUntil(this.destroyed$)
        ).subscribe({
            next: () => this.notifyObserver()
        });
    }

    /**
     * registers to uploads destroy event, since multiple uploads
     * can destroyed in short amount of time we buffer them at least for 10ms.
     * and then remove them from list and notify observer
     */
    private registerUploadDestroyEvent() {
        this.uploadDestroy$.pipe(
            buffer(this.uploadDestroy$.pipe(debounceTime(10))),
            takeUntil(this.destroyed$)
        ).subscribe({
            next: () => this.notifyObserver()
        });
    }

    /**
     * notify observer store data has been changed
     */
    private notifyObserver() {
        this.change$.next(
            Array.from(this.uploads.values())
        );
    }
}
