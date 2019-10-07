import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-item-template--error",
    templateUrl: "error-message.component.html",
})

export class ErrorMessageComponent {

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
