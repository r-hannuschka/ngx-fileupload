import { UploadState } from "../../../data/api";
import { UploadRequest } from "./upload.request";
import { merge, Subject, Observable } from "rxjs";
import { filter, take } from "rxjs/operators";

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

    private registeredUploads: WeakSet<UploadRequest> = new WeakSet();

    public set concurrent(count: number) {
        this.concurrentCount = count;
    }

    /**
     * subscribe to get notified queue has been changed
     */
    private queueChange$: Subject<QueueChange> = new Subject();

    public run(upload: UploadRequest) {
        /** dont add uploads which are allredy in queue or running */
        if (upload.isPending()) {
            return;
        }

        this.registeredUploads.add(upload);

        // should not access the model directly
        upload.state = UploadState.PENDING;
        upload.update();

        if (this.active >= this.concurrentCount) {
            this.addToQueue(upload);
            return;
        }

        this.startUpload(upload);
    }

    public get change(): Observable<QueueChange> {
        return this.queueChange$.asObservable();
    }

    public isRegistered(upload): boolean {
        return this.registeredUploads.has(upload);
    }

    /**
     * checks for upload is in queue
     */
    public isQueued(upload): boolean {
        return this.queuedUploads.indexOf(upload) > -1;
    }

    /**
     * starts new upload
     */
    private startUpload(upload: UploadRequest) {
        this.active += 1;

        const uploadChange$ = upload.change
            .pipe(filter((request) => (
                request.state === UploadState.REQUEST_COMPLETED ||
                request.state === UploadState.CANCELED
            )));

        uploadChange$
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.active -= 1;
                    this.removeFromQueue(upload);

                    const nextUpload = this.getNextFromQueue();
                    if (nextUpload) {
                        this.startUpload(nextUpload);
                    }
                }
            });

        upload.start();
        this.queueChange$.next({add: [], removed: [], start: [upload]});
    }

    private addToQueue(upload: UploadRequest) {
        this.queuedUploads = [...this.queuedUploads, upload];
        this.queueChange$.next({add: [upload], removed: [], start: []});
    }

    /**
     * get next upload request from queue
     */
    private getNextFromQueue(): UploadRequest {
        let nextUploadReq = null;
        while (nextUploadReq === null && this.queuedUploads.length) {
            const nextUpload = this.queuedUploads.shift();
            nextUploadReq = nextUpload && nextUpload.isPending() ? nextUpload : null;

            if (!nextUploadReq) {
                this.registeredUploads.delete(nextUpload);
                this.removeFromQueue(nextUpload);
            }
        }
        return nextUploadReq;
    }

    /**
     * remove upload from queue
     */
    private removeFromQueue(upload: UploadRequest) {
        this.registeredUploads.delete(upload);
        this.queueChange$.next({add: [], removed: [upload], start: []});
    }
}
