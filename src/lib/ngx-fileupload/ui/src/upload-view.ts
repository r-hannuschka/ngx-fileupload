import { Component, TemplateRef, Input, OnInit, OnDestroy } from "@angular/core";
import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { Validator, ValidationFn } from "../../data/api/validation";

import { FileUploadStore } from "../../utils/src/store/upload.store";
import { FileUpload } from "../../utils/src/http/file-upload";
import { UploadStoreManager } from "../../utils/src/store/store.manager";
import { FileUploadItemContext } from "./upload-item.component";

/**
 * NgxFileUploadComponent is a wrapper contain NgxFileUploadDirective and NgxFileUploadComponent
 * to setup a upload view very quickly. All options will passed directly to NgxFileUploadDirective
 * or NgxFileUploadComponent. This component simply handle all events / changes from upload.
 *
 * @example
 * <!-- base implementation //-->
 * <ngx-fileupload [url]="'http://localhost:3000/upload'"></ngx-fileupload>
 *
 * @example
 * <!-- define custom template which will be used for visual representation for one upload //-->
 * <ng-template #myItemTemplate let-uploadData="data" let-uploadCtrl="ctrl">
 *    <span>{{uploadData.name}}</span>
 * </ng-template>
 *
 * <ngx-fileupload [url]="'...'" [itemTemplate]="myItemTemplate"></ngx-fileupload>
 *
 * @example
 * <!-- send file without wrapping it into FormData //-->
 * <ngx-fileupload [url]="'...'" [useFormData]="false"></ngx-fileupload>
 */

const UploadViewStoreToken = { name: "UploadStoreToken" };

@Component({
    selector: "ngx-fileupload",
    styleUrls: ["./upload-view.scss"],
    templateUrl: "upload-view.html"
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

    public uploads: FileUpload[] = [];

    public store: FileUploadStore;

    private destroyed$: Subject<boolean>;

    public constructor(
        private storeManager: UploadStoreManager,
    ) {
        this.store = this.storeManager.get(UploadViewStoreToken) || this.storeManager.createStore(UploadViewStoreToken);
        this.destroyed$ = new Subject();
    }

    public ngOnInit() {

        this.store.change()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (uploads) => this.uploads = uploads
            });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
    }

    /**
     * if state is canceled or uploaded remove it
     */
    public onUploadCompleted(upload: FileUpload) {
        this.store.delete(upload);
    }
}
