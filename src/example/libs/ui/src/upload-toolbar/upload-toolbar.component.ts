import { Component, Input, Inject } from "@angular/core";
import { Validator, UploadStorage, UploadOptions, NgxFileUploadFactory } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-ui--upload-toolbar",
    templateUrl: "upload-toolbar.component.html"
})
export class UploadToolbarComponent {

    @Input()
    validator: Validator;

    @Input()
    url: string;

    @Input()
    public storage: UploadStorage;

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
        console.log(this.validator);
        const uploadOptions: UploadOptions = { url: this.url };
        this.storage.add(
            this.uploadFactory.createUploadRequest(files, uploadOptions, this.validator));
    }
}
