import { Component, OnInit, OnDestroy } from "@angular/core";
import { UploadStorage, UploadRequest, UploadApi } from "@r-hannuschka/ngx-fileupload";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiItemTemplateData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiProgressbarCircleData from "@ngx-fileupload-example/data/code/ui/progressbar-circle";

@Component({
    selector: "app-customize--item-template",
    templateUrl: "item-template.component.html",
    styleUrls: ["./item-template.component.scss"]
})
export class ItemTemplateComponent implements OnInit, OnDestroy {

    public code = ExampleCodeData;

    public codeUiItemTemplate = uiItemTemplateData;

    public codeUiProgressbar = uiProgressbarCircleData;

    public showDocs = false;

    public uploadStates = UploadApi.UploadState;

    public uploads: UploadRequest[] = [];

    public storage: UploadStorage;

    public constructor() {
        this.storage = new UploadStorage({
            concurrentUploads: 3
        });
    }

    public toggleDocs() {
        this.showDocs = !this.showDocs;
    }

    public ngOnInit() {
        this.storage.change()
            .subscribe({
                next: (requests: UploadRequest[]) => this.uploads = requests
            });
    }

    public ngOnDestroy() {
        this.storage.destroy();
    }

    public removeUpload(requestId) {
        this.storage.remove(requestId);
    }
}
