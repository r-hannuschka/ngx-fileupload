export const HTML = `
<app-ui--upload-toolbar
    (add)="onUploadAdd($event)"
    (completed)="uploadCompleted($event)"
    [url]="'http://localhost:3000/upload'"
></app-ui--upload-toolbar>

<!-- fileuploads goes here -->
<div class="upload-items">
    <ng-container *ngFor="let upload of uploads">
        <ngx-fileupload-item [upload]="upload" class="mb-3"></ngx-fileupload-item>
    </ng-container>
</div>
`;

export const TYPESCRIPT = `
import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-customize--file-select",
    templateUrl: "file-select.component.html"
})
export class FileSelectComponent {

    public uploads: Upload[] = [];

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

const LISTING_1 = `<button class="btn"
    [ngxFileUploadFile]="'http://example.url/upload'"
    (add)="onUploadAdd($event)"
    (completed)="uploadCompleted($event)"
>Add Files</button>`;

export const Snippets = {
    Listing1: LISTING_1
};
