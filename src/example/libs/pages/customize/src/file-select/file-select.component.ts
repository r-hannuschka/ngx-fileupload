import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";
import * as BaseCodeData from "@ngx-fileupload-example/data/code/customize/file-select";
import * as uiUploadToolbarData from "@ngx-fileupload-example/data/code/ui/ui-upload-toolbar";

@Component({
    selector: "app-customize--file-select",
    templateUrl: "file-select.component.html",
    styleUrls: ["./file-select.component.scss"]
})
export class FileSelectComponent {

    public code = BaseCodeData;

    public codeUiUploadToolbarData = uiUploadToolbarData;

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
