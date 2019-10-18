import { Component, TemplateRef, Input, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Validator, ValidationFn } from "../../data/api/validation";
import { UploadRequest, UploadStore, UploadStoreManager } from "../../utils/upload";
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
        this.store = this.storeManager.get(UploadViewStoreToken) || this.storeManager.createStore(UploadViewStoreToken);
        this.destroyed$ = new Subject();
    }

    public ngOnInit() {
        this.store.change()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (uploads) => {
                    this.uploads = uploads;
                }
            });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
    }

    /**
     * if state is canceled or uploaded remove it
     * if we enter the site again, it will instant trigger
     * store change, and this will throw an change detection error since we
     * modify data view has not been complete in change detection
     */
    public onUploadCompleted(upload: UploadRequest) {
        // this.store.remove(upload);
    }

    public uploadAll() {
        this.store.startAll(5);
    }

    public stopAll() {
        this.store.stopAll();
    }

    public cleanAll() {
        this.store.purge();
    }
}
