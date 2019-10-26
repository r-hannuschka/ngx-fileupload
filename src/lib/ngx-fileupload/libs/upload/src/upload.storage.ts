import { UploadRequest } from "./upload.request";
import { BehaviorSubject, Observable } from "rxjs";
import { UploadQueue, QueueState } from "./upload.queue";

export interface UploadStorageConfig {
    concurrentUploads: number;

    /** not implemented yet */
    removeCompletedUploads?: boolean;
}

/**
 * could renamed to upload manager
 * maybe we change this design to redux ... dont know
 */
export class UploadStorage {

    private change$: BehaviorSubject<UploadRequest[]>;
    private uploads: Map<string, UploadRequest> = new Map();
    private uploadQueue: UploadQueue;

    public constructor(config?: UploadStorageConfig) {
        this.change$     = new BehaviorSubject([]);
        this.uploadQueue = new UploadQueue();

        this.uploadQueue.concurrent = config.concurrentUploads || 5;
    }

    public change(): Observable<UploadRequest[]> {
        return this.change$.asObservable();
    }

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
        this.notifyObserver();
    }

    public destroy() {

        /** destroy all uploads */
        this.uploads.forEach(upload => (upload.destroy()));

        /** destroy upload queue */
        this.uploadQueue.destroy();
        this.uploadQueue = null;


        /** destroy change stream */
        this.change$.complete();
        this.change$ = null;

        this.uploads = null;
    }

    /**
     * remove upload from store
     */
    public remove(upload: UploadRequest | string) {
        const id = upload instanceof UploadRequest ? upload.requestId : upload;
        const request = this.uploads.get(id);
        request.destroy();
        this.uploads.delete(id);
        this.notifyObserver();
    }

    /**
     * remove all uploads which has been invalid
     * canceled or upload has been completed even it is has an error
     */
    public purge() {
        this.uploads.forEach((upload) => {
            if (upload.isCompleted() || upload.isInvalid()) {
                this.uploads.delete(upload.requestId);
                upload.destroy();
            }
        });
        this.notifyObserver();
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
        this.uploads.clear();
        this.notifyObserver();
    }

    /**
     * remove invalidated uploads
     */
    public removeInvalid() {
        this.uploads.forEach((upload) => {
            if (upload.isInvalid()) {
                upload.destroy();
                this.uploads.delete(upload.requestId);
            }
        });
        this.notifyObserver();
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
