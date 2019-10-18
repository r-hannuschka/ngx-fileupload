import { UploadRequest } from "./upload.request";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap, map } from "rxjs/operators";
import { UploadQueue } from "./upload.queue";
import { UploadState } from "../../../data/api";

/**
 * could renamed to upload manager
 * maybe we change this design to redux ... dont know
 */
export class UploadStore {

    private change$: BehaviorSubject<UploadRequest[]>;

    private uploads: UploadRequest[] = [];

    private queue: UploadQueue;

    private hooks: {
        beforeStart: Observable<boolean>[];
    };

    public constructor() {
        this.change$ = new BehaviorSubject([]);
        this.queue   = new UploadQueue();
        this.queue.concurrent = 1;
    }

    public change(): Observable<UploadRequest[]> {
        return this.change$.asObservable();
    }

    public add(upload: UploadRequest) {
        this.uploads = [...this.uploads, upload];

        const beforeStart$ = of(true)
            .pipe(
                // we cant add this to of since this will called instant
                // and not as expected if we subscribe
                map(() => this.queue.isQueued(upload)),
                tap(() => this.queue.run(upload)),
            );

        upload.beforeStart(() => beforeStart$);

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
     * canceled or upload has been completed
     */
    public purge() {
        this.uploads = this.uploads.filter((upload) => {
            let keepUpload = true;
            keepUpload = keepUpload && upload.state !== UploadState.REQUEST_COMPLETED;
            keepUpload = keepUpload && upload.state !== UploadState.INVALID;
            keepUpload = keepUpload && upload.state !== UploadState.CANCELED;
            return keepUpload;
        });
        this.notifyObserver();
    }

    /**
     * starts all queued uploads
     */
    public startAll(limit: number) {
        const uploads = this.uploads.filter((upload) => upload.data.state === UploadState.QUEUED);
        uploads.forEach(upload => upload.start());
    }

    /**
     * not really removing something
     * this is more filtering something
     */
    public removeCompleted() {
        this.uploads = this.uploads.filter(upload => !upload.isCompleted());
        this.notifyObserver();
    }

    /**
     * stops all active uploads
     */
    public stopAll() {
        this.uploads.forEach( upload => (upload.cancel()));
        this.removeCompleted();
    }

    /**
     * remove invalidated uploads
     */
    public removeInvalid() {
        this.uploads = this.uploads.filter((upload) => !upload.isInvalid());
        this.notifyObserver();
    }

    private notifyObserver() {
        this.change$.next(this.uploads);
    }
}
