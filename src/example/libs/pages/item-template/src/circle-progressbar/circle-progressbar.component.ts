import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/examples-item-template/circle-progressbar";
import * as uiUploadToolbarData from "@ngx-fileupload-example/data/code/ui/ui-upload-toolbar";
import * as uiProgressbarCircleData from "@ngx-fileupload-example/data/code/ui/progressbar-circle";

@Component({
    selector: "app-item-template--circle-progressbar",
    templateUrl: "circle-progressbar.component.html",
    styleUrls: ["./circle-progressbar.component.scss"]
})
export class CircleProgressbarComponent {

    public code = ExampleCodeData;

    public codeUiUploadToolbarData = uiUploadToolbarData;

    public codeUiProgressbarCircleData = uiProgressbarCircleData;

    public uploads: Upload[] = [];

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public uploadCompleted(completed: Upload) {
        if (!completed.hasError()) {
            this.uploads = this.uploads.filter((upload) => completed !== upload);
        }
    }
}
