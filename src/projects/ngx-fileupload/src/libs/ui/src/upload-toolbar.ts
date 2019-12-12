import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { UploadStorage } from "../../upload";
import { UploadRequest } from "../../api";

interface InfoData {
    error: number;
    idle: number;
    pending: number;
    progress: number;
}

@Component({
    selector: "ngx-fileupload-toolbar",
    templateUrl: "upload-toolbar.html",
    styleUrls: ["./upload-toolbar.scss"]
})
export class UploadToolbarComponent implements OnInit, OnDestroy {

    @Input()
    public storage: UploadStorage;

    public uploadInfo: InfoData = { error: 0, pending: 0, idle: 0, progress: 0 };

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
                this.updateInfoBar(uploads);
                this.isCleanable      = uploads.some(upload => upload.isCompleted(true) || upload.isInvalid());
                this.hasUploadsInList = uploads.length > 0;
            });
    }

    private updateInfoBar(uploads: UploadRequest[]) {
        this.uploadInfo = uploads.reduce<InfoData>((data, upload) => {
            return {
                error   : data.error    + (upload.hasError() || upload.isInvalid() ? 1 : 0),
                idle    : data.idle     + (upload.isIdle() ? 1 : 0),
                pending : data.pending  + (upload.isPending() ? 1 : 0),
                progress: data.progress + (upload.isProgress() ? 1 : 0)
            };
        }, {idle: 0, pending: 0, error: 0, progress: 0});
    }
}
