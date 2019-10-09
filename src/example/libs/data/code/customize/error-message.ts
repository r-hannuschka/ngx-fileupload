export const HTML = `
<!--
   UPLOAD ITEM TEMPLATE
-->
<ng-template #uploadTemplate let-upload="data" let-ctrl="ctrl">

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

            <!--
                show response errors
            -->
            <ul *ngIf="upload.state === 'error'" class="errors">
                <li *ngFor="let error of upload.response.errors" class="message error">
                    {{error}}
                </li>
            </ul>
        </div>
        only show is upload state is not error (this not includes invalid)
        <div class="col col-auto actions">

            <div class="btn-group">
                <app-ui--button (dispatch)="control.start()" [label]="'Upload'" *ngIf="upload.state !== 'error'>
                    <i class="icon-left icon-upload"></i>
                </app-ui--button>

                <!--
                    show retry button if upload got an error, this not includes an invalid upload
                -->
                <app-ui--button (dispatch)="control.retry()" [label]="'Retry'" *ngIf="upload.state === 'error'">
                    <i class="icon-left icon-upload"></i>
                </app-ui--button>

                <app-ui--button (dispatch)="control.stop()" [label]="'Abort'">
                    <i class="icon-left icon-cancel-outline"></i>
                </app-ui--button>
            </div>
        </div>
    </div>
</ng-template>

<!--
    UPLOAD TOOLBAR (control / add ) files
-->
<app-ui--upload-toolbar
    (add)="onUploadAdd($event)"
    (completed)="uploadCompleted($event)"
    [url]="'http://localhost:3000/upload/error'"
</app-ui--upload-toolbar>

<!--
    Show Fileuploads on this place
 -->
<div class="upload-items">
    <ng-container *ngFor="let upload of uploads">
        <ngx-fileupload-item [template]="uploadTemplate" [upload]="upload"></ngx-fileupload-item>
    </ng-container>
</div>
`;

export const TYPESCRIPT = `
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
`;

export const SCSS = `
    /** no scss */
`;

