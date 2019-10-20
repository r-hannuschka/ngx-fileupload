import { UploadState } from "../../../data/api";
import { UploadRequest } from "./upload.request";
import { Subject, Observable, of } from "rxjs";
import { filter, take, map, takeUntil, tap } from "rxjs/operators";

export interface QueueChange {
    /**
     * new upload was added to queue
     */
    add: UploadRequest[];
    /**
     * upload starts
     */
    start: UploadRequest[];
    /**
     * upload has finish uploading, canceled
     * and not registered in queue anymore
     */
    removed: UploadRequest[];
}

export class UploadQueue {

    private active = 0;

    private queuedUploads: UploadRequest[] = [];

    private concurrentCount = -1;

    public set concurrent(count: number) {
        this.concurrentCount = count;
    }

    /**
     * subscribe to get notified queue has been changed
     */
    private queueChange$: Subject<QueueChange> = new Subject();

    public add(upload: UploadRequest) {
        this.registerUploadEvents(upload);
        upload.beforeStart(() => this.createBeforeStartHook(upload));
    }

    public get change(): Observable<QueueChange> {
        return this.queueChange$.asObservable();
    }

    /**
     * create before start hook, if any upload wants to start we have to check
     *
     * 1. upload is registered in queue
     * 2. upload is currently not queued
     *
     * otherwise this will return false and prevent upload to start,
     * after that upload will pushed to queue and start again if queue has space
     */
    private createBeforeStartHook(upload: UploadRequest): Observable<boolean> {
        return of(true).pipe(
            map(() => this.active < this.concurrentCount),
            tap((isStartAble: boolean) => {
                if (!isStartAble) {
                    upload.model.state = UploadState.PENDING;
                    /** @todo remove this, dont like it */
                    upload.update();

                    this.queuedUploads.push(upload);
                    this.queueChange$.next({add: [upload], removed: [], start: []});
                }
            })
        );
    }

    /**
     * register to upload change
     */
    private registerUploadEvents(request: UploadRequest) {
        const change$ = request.change;

        /** register for changes which make request complete */
        const uploadComplete$ = change$
            .pipe( filter(() => request.isCompleted()), take(1));

        change$
            /** take all until upload was completed (uploaded with success or canceled) */
            .pipe(takeUntil(uploadComplete$))
            .subscribe({
                next: () => this.onUploadStateChange(request),
                complete: () => this.uploadCompleted(request)
            });
    }

    private onUploadStateChange(req: UploadRequest) {
        switch (req.state) {

            case UploadState.START:
                this.active += 1;
                this.queueChange$.next({add: [], removed: [], start: [req]});
                break;

            /** request has been completed but with an error */
            case UploadState.REQUEST_COMPLETED:
                this.uploadCompleted(req, false);
                break;
        }
    }

    private uploadCompleted(request: UploadRequest, remove = true) {
        this.active -= 1;
        if (remove) {
            this.queueChange$.next({add: [], removed: [request], start: []});
        }
        this.startNextFromQueue();
    }

    /**
     * get next upload request from queue
     */
    private startNextFromQueue() {
        if (this.queuedUploads.length > 0) {
            const nextUpload = this.queuedUploads.shift();
            nextUpload.start();
        }
    }
}
