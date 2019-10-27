import { Component, Input } from "@angular/core";
import { Validator, UploadStorage } from "@r-hannuschka/ngx-fileupload";

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

    public uploadAll() {
        this.storage.startAll();
    }

    public purge() {
        this.storage.purge();
    }

    public stop() {
        this.storage.stopAll();
    }
}
