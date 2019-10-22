import { UploadRequest } from "./upload.request";
import { BehaviorSubject, Observable } from "rxjs";
import { map, buffer, debounceTime, takeWhile } from "rxjs/operators";
import { UploadQueue, QueueChange } from "./upload.queue";

export interface UploadStorageConfig {
    concurrentUploads: number;
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
    private queueChange$: Observable<QueueChange>;
    private queueChangeSubs = 0;

    public constructor(config?: UploadStorageConfig) {
        this.change$     = new BehaviorSubject([]);
        this.uploadQueue = new UploadQueue();

        this.uploadQueue.concurrent = config.concurrentUploads || 5;
    }

    public change(): Observable<UploadRequest[]> {
        return this.change$.asObservable();
    }

    public get queueChange(): Observable<QueueChange> {
        return new Observable((subscriber) => {
            this.queueChangeSubs += 1;
            if (!this.queueChange$) {
                this.queueChange$ = this.createQueueChangeBroadcast();
            }

            const sub = this.queueChange$.subscribe(subscriber);

            /** unsubscribe */
            return () => {
                this.queueChangeSubs -= 1;
                sub.unsubscribe();
            };
        });
    }

    /**
     * add new upload to store
     */
    public add(upload: UploadRequest) {
        this.uploads.set(upload.requestId, upload);
        this.uploadQueue.register(upload);
        this.notifyObserver();
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
                upload.destroy();
                this.uploads.delete(upload.requestId);
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

    private createQueueChangeBroadcast(): Observable<QueueChange> {
        const change$ = this.uploadQueue.change;
        return change$.pipe(
            takeWhile(() => this.queueChangeSubs > 0),
            /** buffer until change$ not submitting for at least 10ms */
            buffer(change$.pipe(debounceTime(10))),
            /** merge all changes into single change object */
            map((changes) => {
                const emptyChange: QueueChange = {add: [], completed: [], start: []};
                return changes.reduce((change, buffered) => (
                    {
                        add: [...change.add    , ...buffered.add    ],
                        completed: [...change.completed, ...buffered.completed],
                        start: [...change.start  , ...buffered.start  ],
                    }
                ), emptyChange);
            }),
        );
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
