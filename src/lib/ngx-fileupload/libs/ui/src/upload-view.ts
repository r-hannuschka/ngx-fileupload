import { Component, TemplateRef, Input, OnInit, OnDestroy, InjectionToken, Inject } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Validator, ValidationFn } from "../../../data/api/validation";
import { UploadRequest, UploadStorage } from "../../upload";
import { FileUploadItemContext } from "./upload-item.component";

const DefaultUploadStorage = new InjectionToken<UploadStorage>("Default Testing Upload Storage", {
    providedIn: "root",
    factory: (() => {
        const storeConfig = {
            concurrentUploads: 2
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

    @Input()
    public set storage(storage: UploadStorage) {
        this.uploadStorage = storage;
        this.uploadStorageSet = true;
    }

    public get storage(): UploadStorage {
        return this.uploadStorage;
    }

    public uploads: UploadRequest[] = [];

    private destroyed$: Subject<boolean>;

    private uploadStorage: UploadStorage;

    private uploadStorageSet = false;

    public constructor() {
        this.destroyed$ = new Subject();
    }

    public ngOnInit() {

        if (!this.uploadStorage) {
            this.uploadStorage = new UploadStorage({
                concurrentUploads: 5
            });
        }

        this.registerStoreEvents();
        this.registerQueueEvents();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);

        /** we handle our own storage so destroy this one */
        if (!this.uploadStorageSet) {
            this.uploadStorage.stopAll();
            this.uploadStorage = null;
        }
    }

    /**
     * register events for store changes
     */
    private registerStoreEvents() {
        this.uploadStorage.change()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (uploads) => this.uploads = uploads
            });
    }

    /**
     * register for queue changes
     */
    private registerQueueEvents() {
        this.uploadStorage.queueChange
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => this.handleQueueChange()
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

    /** start upload for all files */
    public uploadAll() {
        this.uploadStorage.startAll();
    }

    /** stop all uploads */
    public stopAll() {
        this.uploadStorage.stopAll();
    }

    /** purge uploads, invalid, completed, canceled will be removed */
    public cleanAll() {
        this.uploadStorage.purge();
    }
}
