import { Subject, merge } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { NgxFileUploadState } from '../../api';
import type { NgxFileUploadRequest } from './upload.request';

export class NgxFileUploadQueue {
  private active = 0;

  private queuedUploads: NgxFileUploadRequest[] = [];

  private concurrentCount = -1;

  private observedUploads = new WeakSet<NgxFileUploadRequest>();

  private queue$ = new Subject<NgxFileUploadRequest>();

  constructor() {
    this.queue$.subscribe((request) => {
      request.state = NgxFileUploadState.PENDING;
      this.writeToQueue(request);
    });
  }

  public set concurrent(count: number) {
    this.concurrentCount = count;
  }

  public register(upload: NgxFileUploadRequest) {
    this.registerUploadChange(upload);
  }

  /**
   * register to upload change
   */
  private registerUploadChange(request: NgxFileUploadRequest): void {
    if (!this.observedUploads.has(request)) {
      this.observedUploads.add(request);

      const change$ = request.change;

      /** register for changes which make request complete */
      const uploadComplete$ = change$.pipe(
        filter(() => request.isCompleted(true)),
        take(1),
      );

      change$
        .pipe(
          takeUntil(merge(request.destroyed, uploadComplete$)),
          distinctUntilChanged(),
          filter((data) => data.state === NgxFileUploadState.START),
        )
        .subscribe({
          next: () => this.queue$.next(request),
          complete: () => this.requestCompleted(request),
        });
    }
  }

  private writeToQueue(request: NgxFileUploadRequest) {
    if (this.active < this.concurrentCount || this.concurrentCount === -1) {
      this.runRequest(request);
      return;
    }

    this.queuedUploads = [...this.queuedUploads, request];
  }

  private runRequest(request: NgxFileUploadRequest) {
    this.active += 1;
    request.state = NgxFileUploadState.CONNECT;
    request.run();
  }

  /**
   * requests gets completed, this means request is pending or was progressing and the user
   * cancel request, remove it or even destroys them
   */
  private requestCompleted(request: NgxFileUploadRequest) {
    if (this.isInUploadQueue(request)) {
        this.removeFromQueue(request)
     } else {
        this.startNextInQueue();
     }
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
  private removeFromQueue(request: NgxFileUploadRequest) {
    this.queuedUploads = this.queuedUploads.filter((upload) => upload !== request);
  }

  private startNextInQueue() {
    this.active = Math.max(this.active - 1, 0);
    if (this.queuedUploads.length > 0) {
      const nextUpload = this.queuedUploads.shift() as NgxFileUploadRequest;
      this.runRequest(nextUpload);
    }
  }
}
