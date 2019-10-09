import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";
import * as BaseCodeData from "@ngx-fileupload-example/data/code/customize/base";
import * as uiUploadToolbarData from "@ngx-fileupload-example/data/code/ui/ui-upload-toolbar";

@Component({
    selector: "app-item-template--base",
    templateUrl: "base-item.component.html",
    styleUrls: ["./base-item.component.scss"]
})
export class BaseItemComponent {

    public code = BaseCodeData;

    public codeUiUploadToolbarData = uiUploadToolbarData;

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
