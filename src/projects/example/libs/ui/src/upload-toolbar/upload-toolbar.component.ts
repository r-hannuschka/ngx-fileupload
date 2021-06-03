import { Component, Input, Inject } from "@angular/core";
import { NgxFileUploadValidator, NgxFileUploadStorage, NgxFileUploadOptions, NgxFileUploadFactory } from "@ngx-file-upload/core";

@Component({
    selector: "app-ui--upload-toolbar",
    templateUrl: "upload-toolbar.component.html"
})
export class UploadToolbarComponent {

    @Input()
    validator: NgxFileUploadValidator | undefined;

    @Input()
    url: string | undefined;

    @Input()
    public storage: NgxFileUploadStorage | undefined;

    public constructor(
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {}

    public uploadAll() {
        if (this.storage) {
            this.storage.startAll();
        }
    }

    public purge() {
        if (this.storage) {
            this.storage.purge();
        }
    }

    public stop() {
        if (this.storage) {
            this.storage.stopAll();
        }
    }

    public drop(files: File[]) {

        if (this.url && this.storage)  {
            const uploadOptions: NgxFileUploadOptions = { url: this.url, headers: { authorization: {token: "foofoo"}} };
            this.storage.add(this.uploadFactory.createUploadRequest(files, uploadOptions, this.validator));
        }
    }
}
