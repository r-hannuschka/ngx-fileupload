import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiItemTemplateData from "@ngx-fileupload-example/data/code/customize/item-template";
import * as uiProgressbarCircleData from "@ngx-fileupload-example/data/code/ui/progressbar-circle";

@Component({
    selector: "app-customize--item-template",
    templateUrl: "item-template.component.html",
    styleUrls: ["./item-template.component.scss"]
})
export class ItemTemplateComponent {

    public code = ExampleCodeData;

    public codeUiItemTemplate = uiItemTemplateData;

    public codeUiProgressbar = uiProgressbarCircleData;

    public uploads: Upload[] = [];

    public showDocs = false;

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public uploadCompleted(completed: Upload) {
        if (!completed.hasError()) {
            this.uploads = this.uploads.filter((upload) => completed !== upload);
        }
    }

    public toggleDocs() {
        this.showDocs = !this.showDocs;
    }
}
