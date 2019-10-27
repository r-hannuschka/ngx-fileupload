import { UploadState } from "../../../data/api";
import { UploadRequest } from "./upload.request";
import { Observable, of, merge, BehaviorSubject } from "rxjs";
import { filter, take, map, takeUntil, tap, buffer, debounceTime } from "rxjs/operators";

export interface QueueState {

    pending: UploadRequest[];

    processing: UploadRequest[];
}

export class UploadQueue {

    private active = 0;

    private queuedUploads: UploadRequest[] = [];

    private progressingUploads: UploadRequest[] = [];

    private concurrentCount = -1;

    /**
     * subscribe to get notified queue has been changed
     */
    private queueChange$: BehaviorSubject<QueueState>;

    public set concurrent(count: number) {
        this.concurrentCount = count;
    }

    public get change(): Observable<QueueState> {
        const queueChanged  = this.queueChange$.asObservable();
        return queueChanged
            .pipe(
                buffer(queueChanged.pipe(debounceTime(10))),
                map((bufferedChanges) => bufferedChanges.pop()),
            );
    }

    public constructor() {
        this.queueChange$ = new BehaviorSubject({
            pending: [], processing: []
        });
    }

    public register(upload: UploadRequest) {
        this.registerUploadEvents(upload);
        upload.beforeStart(() => this.createBeforeStartHook(upload));
    }

    public destroy() {
        this.queueChange$.complete();

        this.queueChange$       = null;
        this.queuedUploads      = null;
        this.progressingUploads = null;
        this.active             = null;
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
                    upload.state = UploadState.PENDING;
                    upload.update();
                    this.queuedUploads.push(upload);
                    this.notifyObserver();
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
            .pipe(filter(() => request.isCompleted()), take(1));

        change$
            /**
             * take all until upload was completed (uploaded with success or canceled)
             * we dont remove sub if upload completed with an error since the upload request
             * can be repeated, so we dont lose our subscription on this.
             *
             * canceled uploads or upload completed with success couldn't repeat they are
             * simply done
             */
            .pipe(takeUntil(merge(request.destroyed, uploadComplete$)))
            .subscribe({
                next: ()     => this.onUploadStateChange(request),
                complete: () => this.requestCompleted(request)
            });
    }

    private onUploadStateChange(req: UploadRequest) {
        switch (req.state) {

            case UploadState.START:
                this.active += 1;
                this.progressingUploads.push(req);
                this.notifyObserver();
                break;

            /** request has been completed but with an error */
            case UploadState.COMPLETED:
                this.requestCompleted(req);
                break;
        }
    }

    private requestCompleted(request: UploadRequest) {
        let updateQueue = true;

        switch (request.state) {
            /**
             * request gets destroyed but was idle
             * in this case the upload is not in progressing uploads nor
             * in queued uploads
             */
            case UploadState.IDLE:
                updateQueue = false;
                break;

            default:
                this.isInUploadQueue(request)
                    ? this.removeFromQueue(request)
                    : this.startNextInQueue(request);
        }

        if (updateQueue) {
            this.notifyObserver();
        }
    }

    /**
     * checks upload is in queue
     */
    private  isInUploadQueue(request: UploadRequest): boolean {
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
    private startNextInQueue(request: UploadRequest) {

        this.progressingUploads = this.progressingUploads.filter((upload) => upload !== request);

        this.active = Math.max(this.active - 1, 0);
        if (this.queuedUploads.length > 0) {
            const nextUpload = this.queuedUploads.shift();
            nextUpload.start();
        }
    }

    private notifyObserver() {
        this.queueChange$.next({
            pending:    [...this.queuedUploads],
            processing: [...this.progressingUploads]
        });
    }
}
