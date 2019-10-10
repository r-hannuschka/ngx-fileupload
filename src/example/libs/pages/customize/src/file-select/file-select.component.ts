import { Component, OnDestroy } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";
import * as BaseCodeData from "@ngx-fileupload-example/data/code/customize/file-select";
import * as uiUploadToolbarData from "@ngx-fileupload-example/data/code/ui/ui-upload-toolbar";

@Component({
    selector: "app-customize--file-select",
    templateUrl: "file-select.component.html",
    styleUrls: ["./file-select.component.scss"]
})
export class FileSelectComponent implements OnDestroy {

    public code = BaseCodeData;

    public codeUiUploadToolbarData = uiUploadToolbarData;

    public uploads: Upload[] = [];

    public listing1Uploads: Upload[] = [];

    public listing2Uploads: Upload[] = [];

    public listingFinalUploads: Upload[] = [];

    public showDocs = false;

    public ngOnDestroy() {
        this.uploads = null;
        this.listing1Uploads = null;
        this.listing2Uploads = null;
    }

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public listing1Add(uploads: Upload[]) {
        this.listing1Uploads = [...this.listing1Uploads, ...uploads];
    }

    public listing2Add(uploads: Upload[]) {
        this.listing2Uploads = [...this.listing2Uploads, ...uploads];
    }

    public listingFinalAdd(uploads: Upload[]) {
        this.listingFinalUploads = [...this.listingFinalUploads, ...uploads];
    }

    public uploadCompleted(completed: Upload) {
        if (!completed.hasError()) {
            this.uploads = this.uploads.filter((upload) => completed !== upload);
        }
    }

    uploadCompletedFinal(completed: Upload) {
        this.listingFinalUploads = this.listingFinalUploads.filter((upload) => completed !== upload);
    }

    public toggleDocs() {
        this.showDocs = !this.showDocs;
        this.listing1Uploads = [];
        this.listing2Uploads = [];
        this.listingFinalUploads = [];
    }
}
