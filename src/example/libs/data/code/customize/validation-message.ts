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
                Render all validation Errors to list
            -->
            <ul *ngIf="upload.state === 'invalid'" class="errors">
                <li *ngFor="let error of upload.validation.errors | keyvalue" class="message error">
                    {{error.value}}
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
</ng-template>

<!--
    UPLOAD TOOLBAR (control / add ) files
-->
<app-ui--upload-toolbar
    (add)="onUploadAdd($event)"
    (completed)="uploadCompleted($event)"
    [url]="'http://localhost:3000/upload'"
    <!--
       pass validators
    -->
    [validator]="validation">
</app-ui--upload-toolbar>

<!--
    Show Fileuploads on this place
 -->
<div class="upload-items">
    <ng-container *ngFor="let upload of uploads">
        <!-- completed lieber nach oben ziehen -->
        <ngx-fileupload-item [template]="uploadTemplate" [upload]="upload"></ngx-fileupload-item>
    </ng-container>
</div>
`;

export const TYPESCRIPT = `
import { Component, OnInit } from "@angular/core";
import { Upload, ValidationBuilder, GroupedValidator } from "@r-hannuschka/ngx-fileupload";
import { MaxUploadSizeValidator, OnlyZipValidator } from "@ngx-fileupload-example/utils/validators";

@Component({
    selector: "app-item-template--validation",
    templateUrl: "validation-message.component.html",
})

export class ValidationMessageComponent implements OnInit {

    public uploads: Upload[] = [];

    public validation: GroupedValidator;

    public ngOnInit() {

        /** create validators */
        const sizeValidator = new MaxUploadSizeValidator();
        const zipValidator  = new OnlyZipValidator();

        /** create AND group since both must validate */
        this.validation = ValidationBuilder.and(
            sizeValidator,
            zipValidator
        );
    }

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public uploadCompleted(completed: Upload) {
        if (!completed.hasError()) {
            this.uploads = this.uploads.filter((upload) => completed !== upload);
        }
    }
}
`;

export const SCSS = `
    /** no scss */
`;
