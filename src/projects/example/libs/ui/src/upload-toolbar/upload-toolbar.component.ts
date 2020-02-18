import { Component, Input, Inject } from "@angular/core";
import { NgxFileUploadValidator, NgxFileUploadStorage, NgxFileUploadOptions, NgxFileUploadFactory } from "@ngx-file-upload/core";

@Component({
    selector: "app-ui--upload-toolbar",
    templateUrl: "upload-toolbar.component.html"
})
export class UploadToolbarComponent {

    @Input()
    validator: NgxFileUploadValidator;

    @Input()
    url: string;

    @Input()
    public storage: NgxFileUploadStorage;

    public constructor(
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {}

    public uploadAll() {
        this.storage.startAll();
    }

    public purge() {
        this.storage.purge();
    }

    public stop() {
        this.storage.stopAll();
    }

    public drop(files: File[]) {
        const uploadOptions: NgxFileUploadOptions = { url: this.url, headers: { authorization: {token: "foofoo"}} };
        this.storage.add(
            this.uploadFactory.createUploadRequest(files, uploadOptions, this.validator));
    }
}
