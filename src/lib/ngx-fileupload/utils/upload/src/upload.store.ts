import { UploadRequest } from "./upload.request";
import { BehaviorSubject, Observable } from "rxjs";
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

    public constructor() {
        this.change$ = new BehaviorSubject([]);
        this.queue   = new UploadQueue();
    }

    public change(): Observable<UploadRequest[]> {
        return this.change$.asObservable();
    }

    public add(upload: UploadRequest) {
        this.uploads = [...this.uploads, upload];
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

        if (limit) {
            this.queue.concurrent = limit;
            uploads.forEach(upload => this.queue.run(upload));
        } else {
            uploads.forEach(upload => upload.start());
        }
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
