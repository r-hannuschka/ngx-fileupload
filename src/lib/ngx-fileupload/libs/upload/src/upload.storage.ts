import { UploadRequest } from "./upload.request";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { buffer, debounceTime, tap, takeUntil, distinctUntilKeyChanged } from "rxjs/operators";
import { UploadQueue, QueueState } from "./upload.queue";

export interface UploadStorageConfig {
    concurrentUploads?: number;

    /** not implemented yet */
    removeCompletedUploads?: boolean;
}

const defaultStoreConfig: UploadStorageConfig = {
    concurrentUploads: 5
};

/**
 * could renamed to upload manager
 * maybe we change this design to redux ... dont know
 */
export class UploadStorage {

    private change$: BehaviorSubject<UploadRequest[]>;
    private uploads: Map<string, UploadRequest> = new Map();
    private uploadQueue: UploadQueue;

    private storeConfig: UploadStorageConfig;

    /**
     * submits if an upload gets destroyed
     */
    private uploadDestroy$: Subject<UploadRequest> = new Subject();

    private uploadStateChange$: Subject<void> = new Subject();

    public constructor(config: UploadStorageConfig = {}) {
        this.change$     = new BehaviorSubject([]);
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
     * gets notified if queue changes
     */
    public get queueChange(): Observable<QueueState> {
        return this.uploadQueue.change;
    }

    /**
     * add new upload to store
     */
    public add(upload: UploadRequest) {
        this.uploads.set(upload.requestId, upload);

        if (!upload.isInvalid()) {
            this.uploadQueue.register(upload);
        }

        upload.change
            .pipe(
                distinctUntilKeyChanged("state"),
                takeUntil(upload.destroyed),
            )
            .subscribe({
                next: ()     => this.uploadStateChange$.next(),
                complete: () => this.uploadDestroy$.next(upload)
            });

        this.notifyObserver();
    }

    /**
     * destroy upload storage
     */
    public destroy() {

        /** destroy all uploads */
        this.uploads.forEach(upload => (upload.destroy()));

        /** destroy upload queue */
        this.uploadQueue.destroy();
        this.uploadQueue = null;

        /** destroy change stream */
        this.change$.complete();
        this.change$ = null;

        /** destroy upload destroy stream */
        this.uploadDestroy$.complete();
        this.uploadDestroy$ = null;

        this.uploads = null;
    }

    /**
     * remove upload from store
     */
    public remove(upload: UploadRequest | string) {
        const id = upload instanceof UploadRequest ? upload.requestId : upload;
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
        this.uploads.forEach(upload => (upload.cancel(), upload.destroy()));
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
            tap((request: UploadRequest) => this.uploads.delete(request.requestId)),
            buffer(this.uploadDestroy$.pipe(debounceTime(10))),
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
