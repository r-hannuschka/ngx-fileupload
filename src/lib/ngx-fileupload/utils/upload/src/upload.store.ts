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

    /**
     * change stream if uploads has been changed,
     * add, remove
     */
    private change$: BehaviorSubject<UploadRequest[]>;

    /**
     * all uploads in list
     */
    private uploads: UploadRequest[] = [];

    /**
     * upload queue to prevent to many uploads at the same time
     */
    private queue: UploadQueue;

    public constructor() {
        this.change$ = new BehaviorSubject([]);
        this.queue   = new UploadQueue();
        this.queue.concurrent = 1;
    }

    public change(): Observable<UploadRequest[]> {
        return this.change$.asObservable();
    }

    /**
     * add new upload to store
     */
    public add(upload: UploadRequest) {
        this.uploads = [...this.uploads, upload];

        /** register hook before upload starts */
        upload.beforeStart(() => this.createBeforeStartHook(upload));

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
    public startAll() {
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

    /**
     * create before start hook, if any upload wants to start we have to check
     *
     * 1. upload is registered in queue
     * 2. upload is currently not queued
     *
     * otherwise this will return false and prevent upload to start
     */
    private createBeforeStartHook(upload: UploadRequest): Observable<boolean> {
        return of(true).pipe(
            map(() => {
                const isRegistered = this.queue.isRegistered(upload);
                const isQueued     = this.queue.isQueued(upload);
                return isRegistered && !isQueued;
            }),
            tap(() => {
                if (this.queue.isRegistered(upload)) {
                    this.queue.run(upload);
                }
            })
        );
    }

    /**
     * notify observer store data has been changed
     */
    private notifyObserver() {
        this.change$.next(this.uploads);
    }
}
