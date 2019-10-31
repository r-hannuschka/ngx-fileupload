import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { UploadStorage } from "../../upload";
import { Subject, combineLatest } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";

@Component({
    selector: "ngx-fileupload-toolbar",
    templateUrl: "upload-toolbar.html",
    styleUrls: ["./upload-toolbar.scss"]
})
export class UploadToolbarComponent implements OnInit, OnDestroy {

    @Input()
    public storage: UploadStorage;

    /**
     * count uploads which should uploaded but currently waits
     * for a place into queue
     */
    public pendingCount = 0;

    /**
     * count of all uploads which are currently running
     */
    public progressingCount = 0;

    /**
     * count of all uploads which are currently idle
     */
    public idleCount = 0;

    /**
     * count of all uploads which are completed but got an error
     * and could try to reload
     */
    public errorCount = 0;

    public hasUploadsInList = false;

    /**
     * true if we have completed or invalid uploads
     * in list
     */
    public isCleanable = false;

    /**
     */
    private destroyed$: Subject<boolean> = new Subject();

    ngOnInit() {

        const storeChange = this.storage.change()
            .pipe(debounceTime(10));

        combineLatest([storeChange, this.storage.queueChange])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(([uploads, queueState]) => {

                this.progressingCount = queueState.processing.length;
                this.pendingCount     = queueState.pending.length;

                this.idleCount        = 0;
                this.errorCount       = 0;

                this.hasUploadsInList = uploads.length > 0;
                this.isCleanable = uploads.some(upload => upload.isCompleted() || upload.isInvalid());

                uploads.forEach((upload) => {
                    if (upload.isRequestCompleted() && upload.hasError() || upload.isInvalid()) {
                        this.errorCount++;
                    }

                    if (upload.isIdle()) {
                        this.idleCount++;
                    }
                });
            });
    }

    ngOnDestroy() {
        this.storage = null;
        this.destroyed$.next(true);
    }

    /** start upload for all files */
    public uploadAll() {
        this.storage.startAll();
    }

    /** stop all uploads */
    public stopAll() {
        this.storage.stopAll();
    }

    /** purge uploads, invalid, completed, canceled will be removed */
    public cleanAll() {
        this.storage.purge();
    }
}
