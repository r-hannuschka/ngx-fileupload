import { UploadState } from "../../api";
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

    private observedUploads = new WeakSet<UploadRequest>();

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
     */
    private createBeforeStartHook(upload: UploadRequest): Observable<boolean> {
        return of(true).pipe(
            /**
             * before any download starts we registers on it
             * to get notified when it starts and when it is completed, destroyed
             */
            tap(() => this.registerUploadChange(upload)),
            /**
             * check active uploads and max uploads we could run
             */
            map(() => this.active < this.concurrentCount),
            /**
             * if we could not start upload push it into queue
             */
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
    private registerUploadChange(request: UploadRequest) {

        if (this.observedUploads.has(request))  {
            return;
        }

        const change$ = request.change;

        /** register for changes which make request complete */
        const uploadComplete$ = change$
            .pipe(filter(() => request.isCompleted(true)), take(1));

        change$
            .pipe(
                filter((upload) => upload.state === UploadState.START),
                takeUntil(merge(request.destroyed, uploadComplete$))
            )
            .subscribe({
                next: ()     => this.requestStarting(request),
                complete: () => this.requestCompleted(request)
            });

        this.observedUploads.add(request);
    }

    /**
     * a new request is starting
     */
    private requestStarting(req: UploadRequest) {
        this.active += 1;
        this.progressingUploads.push(req);
        this.notifyObserver();
    }

    /**
     * requests gets completed, this means request is pending or was progressing and the user
     * cancel request, remove it or even destroys them
     */
    private requestCompleted(request: UploadRequest) {
        this.isInUploadQueue(request)
            ? this.removeFromQueue(request)
            : this.startNextInQueue(request);

        this.observedUploads.delete(request);
        this.notifyObserver();
    }

    /**
     * checks upload is in queue
     */
    private isInUploadQueue(request: UploadRequest): boolean {
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
