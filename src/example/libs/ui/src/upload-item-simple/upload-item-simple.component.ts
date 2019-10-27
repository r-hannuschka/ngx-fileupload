import { Component, Input } from "@angular/core";
import { UploadData, UploadControl, UploadApi } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-ui--upload-item-simple",
    templateUrl: "upload-item-simple.component.html",
    styleUrls: ["./upload-item-simple.component.scss"]
})
export class UploadItemSimpleComponent {

    @Input()
    public upload: UploadData;

    @Input()
    public control: UploadControl;
}
