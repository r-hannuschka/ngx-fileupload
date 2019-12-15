import { Component, Input } from "@angular/core";
import { UploadRequestData } from "@ngx-file-upload/core";
import { Control } from "@ngx-file-upload/ui";

@Component({
    selector: "app-ui--upload-item-simple",
    templateUrl: "upload-item-simple.component.html",
    styleUrls: ["./upload-item-simple.component.scss"]
})
export class UploadItemSimpleComponent {

    @Input()
    public upload: UploadRequestData;

    @Input()
    public control: Control;
}
