import { Observable, Subject, ReplaySubject, timer } from "rxjs";
import { takeUntil, distinctUntilKeyChanged, tap, take, filter, switchMap } from "rxjs/operators";
import { INgxFileUploadRequest, NgxFileUploadStorageConfig, INgxFileUploadRequestModel, NgxFileUploadState } from "../../api";
import { NgxFileUploadQueue } from "./upload.queue";

const defaultStoreConfig: NgxFileUploadStorageConfig = {
    concurrentUploads: 5,
    autoStart: false
};

export class NgxFileUploadStorage {

    private change$: ReplaySubject<INgxFileUploadRequest[]>;
    private uploads: Map<string, INgxFileUploadRequest> = new Map();
    private uploadQueue: NgxFileUploadQueue;
    private storeConfig: NgxFileUploadStorageConfig;
    private destroyed$: Subject<boolean> = new Subject();
    private bulkProcess: string[] = [];

    constructor(config?: NgxFileUploadStorageConfig) {
        this.change$     = new ReplaySubject(1);
        this.uploadQueue = new NgxFileUploadQueue();

        this.storeConfig = {...defaultStoreConfig, ...(config || {})};
        this.uploadQueue.concurrent = this.storeConfig.concurrentUploads;
    }

    /**
     * submits if any upload changes his state, uploads
     * gets removed or added
     */
    change(): Observable<INgxFileUploadRequest[]> {
        return this.change$;
    }

    /**
     * add new upload to store
     */
    add(upload: INgxFileUploadRequest | INgxFileUploadRequest[]) {
        const requests = Array.isArray(upload) ? upload : [upload];

        requests.forEach((request: INgxFileUploadRequest) => {
            if (request.requestId && this.uploads.has(request.requestId)) {
                return;
            }
            request.requestId = request.requestId || this.generateUniqeRequestId();
            this.uploads.set(request.requestId, request);

            this.registerUploadEvents(request);
        });

        this.afterUploadsAdd(requests);
        this.notifyObserver();
    }

    destroy() {
        /** remove from all subscriptions */
        this.destroyed$.next(true)
        /** stop all downloads */
        this.stopAll()
        /** destroy change stream */
        this.destroyed$.complete()
        this.change$.complete()
    }

    remove(upload: INgxFileUploadRequest | string) {
        const id = typeof(upload) === "string" ? upload : upload.requestId;
        const request = this.uploads.get(id)
        request?.destroy()
    }

    purge() {
        let notify = false;
        this.uploads.forEach((request) => {
            if (request.isCompleted() || request.isInvalid()) {
                this.bulkProcess.push(request.requestId)
                notify = true
                request.destroy()
            }
        })

        if (notify) {
            this.notifyObserver()
        }
    }

    startAll() {
        this.uploads.forEach((upload) => {
            if (upload.isIdle()) {
                this.bulkProcess.push(upload.requestId)
                upload.start();
            }
        })
        this.notifyObserver()
    }

    stopAll() {
        this.uploads.forEach(upload => {
            this.bulkProcess.push(upload.requestId)
            upload.destroy()
        })
        this.notifyObserver()
    }

    removeInvalid() {
        this.uploads.forEach((upload) => {
            if (upload.isInvalid()) {
                this.bulkProcess.push(upload.requestId)
                upload.destroy()
            }
        });
        this.notifyObserver()
    }

    private registerUploadEvents(request: INgxFileUploadRequest): void {

        if (!request.isInvalid()) {
            this.uploadQueue.register(request);
            this.handleRequestChange(request);
        }

        request.destroyed.pipe(
            tap(() => this.uploads.delete(request.requestId)),
            take(1)
        ).subscribe(() => this.isBulkProcess(request) ? this.removeBulkProcess(request) : this.notifyObserver())
    }

    /**
     * @description register to request change events, this will notify all observers
     * if state from upload state has been changed, this will not notify
     * if amount of uploaded size has been changed
     */
    private handleRequestChange(request: INgxFileUploadRequest) {
        const isAutoRemove = !!(this.storeConfig.removeCompleted ?? 0);
        request.change.pipe(
            distinctUntilKeyChanged("state"),
            tap(() => /** do not notify if bulk process */ {
                if (!this.isBulkProcess(request)) {
                    this.notifyObserver()
                    this.removeBulkProcess(request)
                }
            }),
            /* only continue if completed with no errors and autoremove is enabled */
            filter((upload: INgxFileUploadRequestModel) => upload.state === NgxFileUploadState.COMPLETED && !upload.hasError && isAutoRemove),
            /** wait for given amount of time before we remove item */
            switchMap(() => timer(this.storeConfig.removeCompleted)),
            /* automatically unsubscribe if request gets destroyed */
            takeUntil(request.destroyed),
        )
        .subscribe(() => this.remove(request));
    }

    private afterUploadsAdd(requests: INgxFileUploadRequest[]): void {
        if (this.storeConfig.autoStart) {
            requests.forEach((uploadRequest) => uploadRequest.start());
        }
    }

    private generateUniqeRequestId(): string {
        let reqId: string;
        do {
            reqId = Array.from({length: 4}, () => Math.random().toString(32).slice(2)).join("-");
        } while (this.uploads.has(reqId));
        return reqId;
    }

    private notifyObserver() {
        this.change$.next(Array.from(this.uploads.values()))
    }

    private removeBulkProcess(request: INgxFileUploadRequest) {
        this.bulkProcess = this.bulkProcess.filter((id) => request.requestId !== id)
    }

    private isBulkProcess(request: INgxFileUploadRequest): boolean {
        return this.bulkProcess.indexOf(request.requestId) > -1
    }
}
