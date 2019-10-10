export const HTML = `
<div class="row">
    <div class="col">
        <ul class="details">
            <li>
                <span class="label">Name</span>
                <span class="value text-truncate">{{upload.name}}</span>
            </li>
            <li>
                <span class="label">Size</span>
                <span class="value text-truncate">{{upload.size | fileSize}}</span>
            </li>
            <li>
                <span class="label">Uploaded</span>
                <span class="value text-truncate">{{upload.progress}} %</span>
            </li>
        </ul>

        <!-- display validation errors here -->
        <ul *ngIf="upload.state === 'invalid'" class="errors">
            <li *ngFor="let error of upload.validation.errors | keyvalue" class="message error">
                {{error.value}}
            </li>
        </ul>

        <ul *ngIf="upload.state === 'error'" class="errors">
            <li *ngFor="let error of upload.response.errors" class="message error">
                {{error}}
            </li>
        </ul>
    </div>

    <div class="col col-auto actions">

        <div class="btn-group">
            <app-ui--button (dispatch)="control.start()" [label]="'Upload'">
                <i class="icon-left icon-upload"></i>
            </app-ui--button>

            <app-ui--button (dispatch)="control.stop()" [label]="'Abort'">
                <i class="icon-left icon-cancel-outline"></i>
            </app-ui--button>
        </div>
    </div>
</div>
`;

export const TYPESCRIPT = `
import { Component, Input } from "@angular/core";
import { UploadData, UploadControl } from "@r-hannuschka/ngx-fileupload";

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
`;

export const SCSS = `
    /** no scss */
`;
