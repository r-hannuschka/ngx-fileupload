import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { UploadStorage, UploadRequest, UploadState } from "projects/ngx-fileupload/public-api";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiItemTemplateData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiProgressbarCircleData from "@ngx-fileupload-example/data/code/ui/progressbar-circle";
import * as codeUploadStorage from "@ngx-fileupload-example/data/code/common/upload-storage";
import { ExampleUploadStorage } from "@ngx-fileupload-example/data/base/upload-storage";

@Component({
    selector: "app-customize--item-template",
    templateUrl: "item-template.component.html",
    styleUrls: ["./item-template.component.scss"]
})
export class ItemTemplateComponent implements OnInit, OnDestroy {

    public code = ExampleCodeData;

    public codeUiItemTemplate = uiItemTemplateData;

    public codeUiProgressbar = uiProgressbarCircleData;

    public codeUploadStorage = codeUploadStorage;

    public showDocs = false;

    public uploadStates = UploadState;

    public uploads: UploadRequest[] = [];

    public destroy$: Subject<boolean> = new Subject();

    public constructor(
        @Inject(ExampleUploadStorage) public storage: UploadStorage
    ) {
    }

    public toggleDocs() {
        this.showDocs = !this.showDocs;
    }

    public ngOnInit() {
        this.storage.change()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (requests: UploadRequest[]) => this.uploads = requests
            });
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
    }
}
