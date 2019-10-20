import { UploadRequest } from "./upload.request";
import { BehaviorSubject, Observable } from "rxjs";
import { map, buffer, debounceTime, takeWhile } from "rxjs/operators";
import { UploadQueue, QueueChange } from "./upload.queue";

/**
 * could renamed to upload manager
 * maybe we change this design to redux ... dont know
 */
export class UploadStore {

    private change$: BehaviorSubject<UploadRequest[]>;
    private uploads: UploadRequest[] = [];
    private uploadQueue: UploadQueue;
    private queueChange$: Observable<QueueChange>;
    private queueChangeSubs = 0;

    public constructor() {
        this.change$     = new BehaviorSubject([]);
        this.uploadQueue = new UploadQueue();

        // this.uploadQueue.concurrent = config.concurrentUploads;
        this.uploadQueue.concurrent = 1;
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
        this.uploads = [...this.uploads, upload];
        this.uploadQueue.add(upload);
        this.notifyObserver();
    }

    /**
     * remove upload from store
     */
    public remove(upload: UploadRequest) {
        const index = this.uploads.indexOf(upload);
        if (index !== -1) {
            this.uploads = [
                ...this.uploads.slice(0, index),
                ...this.uploads.slice(index + 1)
            ];
            upload.destroy();
            this.notifyObserver();
        }
    }

    /**
     * remove all uploads which has been invalid
     * canceled or upload has been completed even it is has an error
     */
    public purge() {
        this.uploads = this.uploads.filter((upload) => {
            return upload.isCompleted() ? (upload.destroy(), false) : true;
        });
        this.notifyObserver();
    }

    /**
     * starts all queued uploads
     */
    public startAll() {
        const uploads = this.uploads.filter((upload) => upload.isIdle());
        uploads.forEach(upload => upload.start());
    }

    /**
     * stops all active uploads
     */
    public stopAll() {
        this.uploads.forEach(upload => (upload.cancel(), upload.destroy()));
        this.uploads = [];
        this.notifyObserver();
    }

    /**
     * remove invalidated uploads
     */
    public removeInvalid() {
        this.uploads = this.uploads.filter((upload) => {
            return upload.isInvalid() ? (upload.destroy(), false) : true;
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
        this.change$.next(this.uploads);
    }
}
