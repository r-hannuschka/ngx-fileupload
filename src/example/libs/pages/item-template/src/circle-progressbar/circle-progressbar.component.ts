import { Component } from "@angular/core";
import { Upload, UploadState } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-item-template--circle-progressbar",
    templateUrl: "circle-progressbar.component.html"
})

export class CircleProgressbarComponent {

    public uploads: Upload[] = [];

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public stateChanged(changedUpload: Upload) {

        let uploadDone = changedUpload.data.state === UploadState.CANCELED;
        uploadDone     = uploadDone || changedUpload.data.state === UploadState.UPLOADED;

        /**
         * remove upload from list
         */
        if (uploadDone) {
            this.uploads = this.uploads.filter((upload) => changedUpload !== upload);
        }
    }
}
