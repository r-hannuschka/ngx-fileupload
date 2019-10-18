import { UploadState } from "../../../data/api";
import { UploadRequest } from "./upload.request";
import { merge } from "rxjs";
import { filter } from "rxjs/operators";

export class UploadQueue {

    private active = 0;

    private queuedUploads: UploadRequest[] = [];

    private concurrentCount = -1;

    public set concurrent(count: number) {
        this.concurrentCount = count;
    }

    public run(upload: UploadRequest) {

        /** dont add uploads which are allredy in queue or running */
        if (this.queuedUploads.indexOf(upload) > -1 || upload.data.state !== UploadState.QUEUED) {
            return;
        }

        if (this.active >= this.concurrentCount) {
            this.queuedUploads = [...this.queuedUploads, upload];
            return;
        }

        this.startUpload(upload);
    }

    /**
     * starts new upload
     */
    public startUpload(upload: UploadRequest) {
        this.active += 1;

        const uploadChange$ = upload.change
            .pipe(filter((request) => request.state === UploadState.REQUEST_COMPLETED));

        const sub = merge(uploadChange$, upload.complete)
            .subscribe({
                next: () => {
                    this.active -= 1;
                    const nextUpload = this.getNextFromQueue();
                    if (nextUpload) {
                        this.startUpload(nextUpload);
                    }
                    sub.unsubscribe();
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
            /** get next possible upload from queue */
            const nextUpload = this.queuedUploads.shift();
            /** if upload is queued we can take it */
            nextUploadReq = nextUpload && nextUpload.state === UploadState.QUEUED ? nextUpload : null;
        } while (nextUploadReq === null && this.queuedUploads.length);

        return nextUploadReq;
    }
}
