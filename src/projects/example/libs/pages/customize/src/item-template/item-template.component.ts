import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { NgxFileUploadStorage, NgxFileUploadRequest, NgxFileUploadState } from "@ngx-file-upload/core";
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

    public uploadStates = NgxFileUploadState;

    public uploads: NgxFileUploadRequest[] = [];

    public destroy$: Subject<boolean> = new Subject();

    public constructor(
        @Inject(ExampleUploadStorage) public storage: NgxFileUploadStorage
    ) {
    }

    public toggleDocs() {
        this.showDocs = !this.showDocs;
    }

    public ngOnInit() {
        this.storage.change()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (requests: NgxFileUploadRequest[]) => this.uploads = requests
            });
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public cancelUpload(upload: NgxFileUploadRequest) {
        upload.cancel();
    }

    public removeUpload(upload: NgxFileUploadRequest) {
        this.storage.remove(upload);
    }

    public startUpload(upload: NgxFileUploadRequest) {
        upload.start();
    }
}
