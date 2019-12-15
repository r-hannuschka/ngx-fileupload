import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { UploadStorage, UploadRequest, UploadState } from "@ngx-file-upload/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import * as ExampleCodeData from "projects/example/libs/data/code/customize/item-template";
import * as uiItemTemplateData from "projects/example/libs/data/code/customize/item-template";
import * as codeUploadStorage from "projects/example/libs/data/code/common/upload-storage";
import { ExampleUploadStorage } from "projects/example/libs/data/base/upload-storage";

@Component({
    selector: "app-customize--item-template",
    templateUrl: "item-template.component.html",
    styleUrls: ["./item-template.component.scss"]
})
export class ItemTemplateComponent implements OnInit, OnDestroy {

    public code = ExampleCodeData;

    public codeUiItemTemplate = uiItemTemplateData;

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

    public cancelUpload(upload: UploadRequest) {
        upload.cancel();
    }

    public removeUpload(upload: UploadRequest) {
        this.storage.remove(upload);
    }

    public startUpload(upload: UploadRequest) {
        upload.start();
    }
}
