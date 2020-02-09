import { NgxFileUploadState, NgxFileUploadRequest } from "../../api";
import { Observable, of, merge } from "rxjs";
import { filter, take, map, takeUntil, tap } from "rxjs/operators";

export class NgxFileUploadQueue {

    private active = 0;

    private queuedUploads: NgxFileUploadRequest[] = [];

    private concurrentCount = -1;

    private observedUploads = new WeakSet<NgxFileUploadRequest>();

    public set concurrent(count: number) {
        this.concurrentCount = count;
    }

    public register(upload: NgxFileUploadRequest) {
        upload.beforeStart(this.createBeforeStartHook(upload));
    }

    public destroy() {
        this.queuedUploads = null;
        this.active = null;
    }

    /**
     * create before start hook, if any upload wants to start we have to check
     */
    private createBeforeStartHook(request: NgxFileUploadRequest): Observable<boolean> {
        return of(true).pipe(
            /**
             * before any download starts we registers on it
             * to get notified when it starts and when it is completed, destroyed
             */
            tap(() => this.registerUploadChange(request)),
            /**
             * check active uploads and max uploads we could run
             */
            map(() => this.active < this.concurrentCount),
            /**
             * if we could not start upload push it into queue
             */
            tap((isStartAble: boolean) => {
                if (!isStartAble) {
                    this.writeToQueue(request);
                }
            })
        );
    }

    /**
     * register to upload change
     */
    private registerUploadChange(request: NgxFileUploadRequest): void {

        if (!this.observedUploads.has(request))  {
            this.observedUploads.add(request);

            const change$ = request.change;

            /** register for changes which make request complete */
            const uploadComplete$ = change$
                .pipe(filter(() => request.isCompleted(true)), take(1));

            change$.pipe(
                filter((upload) => upload.state === NgxFileUploadState.START),
                takeUntil(merge(request.destroyed, uploadComplete$))
            ).subscribe({
                next: () => this.active += 1,
                complete: () => {
                    this.requestCompleted(request);
                }
            });
        }
    }

    private writeToQueue(request: NgxFileUploadRequest) {
        request.data.state = NgxFileUploadState.PENDING;
        this.queuedUploads = [...this.queuedUploads, request];
    }

    /**
     * requests gets completed, this means request is pending or was progressing and the user
     * cancel request, remove it or even destroys them
     */
    private requestCompleted(request: NgxFileUploadRequest) {
        this.isInUploadQueue(request)
            ? this.removeFromQueue(request)
            : this.startNextInQueue();

        this.observedUploads.delete(request);
    }

    /**
     * checks upload is in queue
     */
    private isInUploadQueue(request: NgxFileUploadRequest): boolean {
        return this.queuedUploads.indexOf(request) > -1;
    }

    /**
     * remove upload request from queued uploads
     */
    private removeFromQueue(request) {
        this.queuedUploads = this.queuedUploads.filter(upload =>  upload !== request);
    }

    /**
     * try to start next upload in queue, returns false if no further uploads
     * exists
     */
    private startNextInQueue() {
        this.active = Math.max(this.active - 1, 0);
        if (this.queuedUploads.length > 0) {
            const nextUpload = this.queuedUploads.shift();
            nextUpload.start();
        }
    }
}
