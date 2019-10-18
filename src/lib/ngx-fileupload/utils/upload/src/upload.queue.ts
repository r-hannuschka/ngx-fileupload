import { UploadState } from "../../../data/api";
import { UploadRequest } from "./upload.request";
import { merge } from "rxjs";
import { filter, take } from "rxjs/operators";

export class UploadQueue {

    private active = 0;

    private queuedUploads: UploadRequest[] = [];

    private concurrentCount = -1;

    private registeredUploads: WeakSet<UploadRequest> = new WeakSet();

    public set concurrent(count: number) {
        this.concurrentCount = count;
    }

    public run(upload: UploadRequest) {

        /** dont add uploads which are allredy in queue or running */
        if (this.queuedUploads.indexOf(upload) > -1 || upload.data.state !== UploadState.QUEUED) {
            return;
        }

        this.registeredUploads.add(upload);
        upload.model.isPending = true;

        if (this.active >= this.concurrentCount) {
            this.queuedUploads = [...this.queuedUploads, upload];
            return;
        }
        this.startUpload(upload);
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
        upload.model.isPending = false;

        const uploadChange$ = upload.change
            .pipe(filter((request) => request.state === UploadState.REQUEST_COMPLETED));

        merge(uploadChange$, upload.complete)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.active -= 1;
                    this.registeredUploads.delete(upload);

                    const nextUpload = this.getNextFromQueue();
                    if (nextUpload) {
                        this.startUpload(nextUpload);
                    }
                }
            });

        upload.start();
    }

    /**
     * get next upload request from queue
     */
    private getNextFromQueue(): UploadRequest {
        let nextUploadReq = null;
        do {
            const nextUpload = this.queuedUploads.shift();
            nextUploadReq = nextUpload && nextUpload.state === UploadState.QUEUED ? nextUpload : null;

            if (!nextUploadReq) {
                this.registeredUploads.delete(nextUpload);
            }
        } while (nextUploadReq === null && this.queuedUploads.length);

        return nextUploadReq;
    }
}
