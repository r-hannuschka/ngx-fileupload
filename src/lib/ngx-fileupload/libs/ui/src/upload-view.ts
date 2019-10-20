import { Component, TemplateRef, Input, OnInit, OnDestroy } from "@angular/core";
import { takeUntil, tap } from "rxjs/operators";
import { Subject, pipe } from "rxjs";
import { Validator, ValidationFn } from "../../../data/api/validation";
import { UploadRequest, UploadStore, UploadStoreManager } from "../../upload";
import { FileUploadItemContext } from "./upload-item.component";

const UploadViewStoreToken = { name: "UploadStoreToken" };

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

    public store: UploadStore;

    private destroyed$: Subject<boolean>;

    public constructor(
        private storeManager: UploadStoreManager
    ) {

        // we need a configuration for create a store
        // we need a token to register a store

        this.store = this.storeManager.get(UploadViewStoreToken) || this.storeManager.createStore({ config: UploadViewStoreToken });
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
        this.store.change()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (uploads) => this.uploads = uploads
            });
    }

    /**
     * register for queue changes
     */
    private registerQueueEvents() {
        this.store.queueChange
            .pipe(tap((change) => console.dir(change)))
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

    public uploadAll() {
        this.store.startAll();
    }

    public stopAll() {
        this.store.stopAll();
    }

    public cleanAll() {
        this.store.purge();
    }
}
