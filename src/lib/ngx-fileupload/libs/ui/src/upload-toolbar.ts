import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { UploadStorage, UploadRequest } from "../../upload";
import { UploadState } from "../../../data/api";

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

        this.registerStoreChange();
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

    private registerStoreChange() {
        this.storage.change()
            .pipe(
                debounceTime(10),
                takeUntil(this.destroyed$)
            )
            .subscribe((uploads: UploadRequest[]) => {

                this.idleCount        = 0;
                this.pendingCount     = 0;
                this.errorCount       = 0;
                this.progressingCount = 0;

                uploads.forEach((upload: UploadRequest) => {
                    switch (upload.state) {
                        case UploadState.IDLE:
                            this.idleCount += 1;
                            break;

                        case UploadState.PENDING:
                            this.pendingCount += 1;
                            break;

                        case UploadState.START:
                        case UploadState.PROGRESS:
                            this.progressingCount += 1;
                            break;
                    }
                });

                this.isCleanable = uploads.some(upload => upload.isCompleted() || upload.isInvalid());
                this.hasUploadsInList = uploads.length > 0;
            });
    }
}
