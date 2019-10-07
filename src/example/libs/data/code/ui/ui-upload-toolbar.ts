export const HTML = `
<div class="btn-toolbar mb-3">

    <div class="input-group ml-auto"
        [ngxFileUploadFile]="url"
        [validator]="validator"
        (add)="onUploadAdd($event)"
        (completed)="uploadCompleted($event)"
        #uploadFileFieldRef="ngxFileUploadRef"
    >
        <div class="input-group-prepend">
            <div class="input-group-text" id="btnGroupAddon">Files</div>
        </div>
        <input type="text" class="form-control" disabled="disabled" placeholder="Drag Drop or Click">
    </div>

    <div class="btn-group ml-3">
        <button type="button" (click)="uploadFileFieldRef.uploadAll()" class="btn btn-sm btn-secondary">Upload All</button>
        <button type="button" (click)="uploadFileFieldRef.cancelAll()" class="btn btn-sm btn-secondary">Cancel All</button>
        <button type="button" (click)="uploadFileFieldRef.cleanAll()"  class="btn btn-sm btn-secondary">Clean Up</button>
    </div>
</div>
`;

export const TYPESCRIPT = `
import { Component, Output, Input, EventEmitter } from "@angular/core";
import { Upload, Validator } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-ui--upload-toolbar",
    templateUrl: "upload-toolbar.component.html"
})
export class UploadToolbarComponent {

    @Input()
    validator: Validator;

    @Input()
    url: string;

    @Output()
    add: EventEmitter<Upload[]> = new EventEmitter();

    @Output()
    completed: EventEmitter<Upload> = new EventEmitter();

    public onUploadAdd(uploads: Upload[]) {
        this.add.emit(uploads);
    }

    public uploadCompleted(upload: Upload) {
        this.completed.emit(upload);
    }
}
`;

export const SCSS = `
    /** no scss */
`;
