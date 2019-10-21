import { Component, TemplateRef, Input, OnInit, OnDestroy, InjectionToken, Inject } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Validator, ValidationFn } from "../../../data/api/validation";
import { UploadRequest, UploadStorage } from "../../upload";
import { FileUploadItemContext } from "./upload-item.component";

const DefaultUploadStorage = new InjectionToken<UploadStorage>("UploadStorage", {
    providedIn: "root",
    factory: (() => {
        const storeConfig = {
            concurrentUploads: 5
        };
        return new UploadStorage(storeConfig);
    })
});

@Component({
    selector: "ngx-fileupload",
    styleUrls: ["./upload-view.scss"],
    templateUrl: "upload-view.html",
})
export class UploadViewComponent implements OnInit, OnDestroy {

    /**
     * set custom template, will pass through to [NgxFileUploadItem]{@link NgxFileUploadItemComponent.html#itemTpl}
     */
    @Input()
    public itemTemplate: TemplateRef<FileUploadItemContext>;

    @Input()
    public url: string;

    @Input()
    public useFormData = true;

    @Input()
    public formDataName = "file";

    @Input()
    public validator: Validator | ValidationFn;

    public uploads: UploadRequest[] = [];

    private destroyed$: Subject<boolean>;

    public constructor(
        @Inject(DefaultUploadStorage) private storage: UploadStorage
    ) {
        this.destroyed$ = new Subject();
    }

    public ngOnInit() {
        this.registerStoreEvents();
        this.registerQueueEvents();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
    }

    private registerStoreEvents() {
        this.storage.change()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (uploads) => this.uploads = uploads
            });
    }

    /**
     * register for queue changes
     */
    private registerQueueEvents() {
        this.storage.queueChange
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (change) => {
                    this.handleQueueChange();
                }
            });
    }

    /**
     * reorder items now
     * could be an action we dispatch on store, or only for our view
     */
    private handleQueueChange() {
        this.uploads = this.uploads.sort((u1: UploadRequest, u2: UploadRequest) => {
            if (u1.state > u2.state) {
                return -1;
            }
            return 1;
        });
    }

    public uploadAll() {
        this.storage.startAll();
    }

    public stopAll() {
        this.storage.stopAll();
    }

    public cleanAll() {
        this.storage.purge();
    }
}
