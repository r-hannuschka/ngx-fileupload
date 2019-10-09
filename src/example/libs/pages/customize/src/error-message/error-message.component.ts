import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/customize/error-message";
import * as uiUploadToolbarData from "@ngx-fileupload-example/data/code/ui/ui-upload-toolbar";

@Component({
    selector: "app-item-template--error",
    templateUrl: "error-message.component.html",
    styleUrls: ["./error-message.component.scss"]
})

export class ErrorMessageComponent {

    public code = ExampleCodeData;

    public codeUiUploadToolbarData = uiUploadToolbarData;

    public uploads: Upload[] = [];

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public uploadCompleted(upload: Upload) {
        if (!upload.hasError()) {
            this.uploads = this.uploads.filter(_ => _ !== upload);
        }
    }
}
