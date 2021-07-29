import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { INgxFileUploadRequest, NgxFileUploadStorage } from "@ngx-file-upload/core";
import { NgxFileUploadUiI18nProvider, NgxFileUploadUiI18nKey, NgxFileUploadUiI18nToolbar } from "../../i18n";

interface InfoData {
    error: number;
    idle: number;
    pending: number;
    progress: number;
}

@Component({
    selector: "ngx-file-upload-ui--toolbar",
    templateUrl: "toolbar.html",
    styleUrls: ["./toolbar.scss"]
})
export class UploadToolbarComponent implements OnInit, OnDestroy {

    @Input()
    public storage: NgxFileUploadStorage | undefined;

    public uploadInfo: InfoData = { error: 0, pending: 0, idle: 0, progress: 0 };

    public hasUploadsInList = false;

    public i18n: NgxFileUploadUiI18nToolbar | undefined;

    /**
     * true if we have completed or invalid uploads
     * in list
     */
    public isCleanable = false;

    /**
     */
    private destroyed$: Subject<boolean> = new Subject();

    public constructor(
        private i18nProvider: NgxFileUploadUiI18nProvider
    ) {}

    ngOnInit() {
        this.i18n = this.i18nProvider.getI18n<NgxFileUploadUiI18nToolbar>(NgxFileUploadUiI18nKey.ToolBar);
        this.registerStoreChange();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
    }

    /** start upload for all files */
    public uploadAll() {
        if (this.storage) {
            this.storage.startAll();
        }
    }

    /** stop all uploads */
    public stopAll() {
        if (this.storage) {
            this.storage.stopAll();
        }
    }

    /** purge uploads, invalid, completed, canceled will be removed */
    public cleanAll() {
        if (this.storage) {
            this.storage.purge();
        }
    }

    private registerStoreChange() {
        if (this.storage) {
            this.storage.change()
                .pipe(
                    debounceTime(10),
                    takeUntil(this.destroyed$)
                )
                .subscribe((uploads: INgxFileUploadRequest[]) => {
                    this.updateInfoBar(uploads);
                    this.isCleanable      = uploads.some(upload => upload.isCompleted(true) || upload.isInvalid());
                    this.hasUploadsInList = uploads.length > 0;
                });
        }
    }

    private updateInfoBar(uploads: INgxFileUploadRequest[]) {
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
