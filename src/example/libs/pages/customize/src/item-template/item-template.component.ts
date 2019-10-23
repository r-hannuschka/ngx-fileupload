import { Component, Inject, OnInit } from "@angular/core";
import { UploadStorage, UploadRequest, UploadApi, ValidationFn } from "@r-hannuschka/ngx-fileupload";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiItemTemplateData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiProgressbarCircleData from "@ngx-fileupload-example/data/code/ui/progressbar-circle";
import { CTUploadStorage } from "@ngx-fileupload-example/data/base/upload-storage";
import { isImage } from "@ngx-fileupload-example/utils/validators";

@Component({
    selector: "app-customize--item-template",
    templateUrl: "item-template.component.html",
    styleUrls: ["./item-template.component.scss"]
})
export class ItemTemplateComponent implements OnInit {

    public code = ExampleCodeData;

    public codeUiItemTemplate = uiItemTemplateData;

    public codeUiProgressbar = uiProgressbarCircleData;

    public showDocs = false;

    public uploadStates = UploadApi.UploadState;

    public uploads: UploadRequest[] = [];

    public validator: ValidationFn = isImage;

    public constructor(
        @Inject(CTUploadStorage) public storage: UploadStorage
    ) {}

    public toggleDocs() {
        this.showDocs = !this.showDocs;
    }

    public ngOnInit() {
        this.storage.change()
            .subscribe({
                next: (requests: UploadRequest[]) => this.uploads = requests
            });
    }

    public removeUpload(requestId) {
        this.storage.remove(requestId);
    }
}
