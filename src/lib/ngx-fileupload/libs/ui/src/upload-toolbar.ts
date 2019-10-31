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
    public pendingCount = 0;
    public progressingCount = 0;

    /**
     * upload idle count maybe we have to include
     * that option we have canceled or upload completed with an error
     */
    public idleCount = 0;

    private destroyed$: Subject<boolean> = new Subject();

    ngOnInit() {

        const storeChange = this.storage.change()
            .pipe(debounceTime(10));

        combineLatest([storeChange, this.storage.queueChange])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(([uploads, queueState]) => {
                this.progressingCount = queueState.processing.length;
                this.pendingCount     = queueState.pending.length;
                this.idleCount        = uploads.filter((upload) => upload.isIdle()).length;
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
