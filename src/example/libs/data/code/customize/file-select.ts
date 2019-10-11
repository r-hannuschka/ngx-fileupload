export const HTML = `
<app-ui--upload-toolbar
    (add)="onUploadAdd($event)"
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
        this.uploads = this.uploads.filter((upload) => completed !== upload);
    }
}`;

const LISTING_1_HTML = `
<!-- add ngx-fileupload directive to button, trigger add new uploads on select / drag drop -->
<div class="btn" [ngxFileUpload]="'http://example.url/upload'" (add)="onUploadAdd($event)">Add Files</div>
`;

const LISTING_1_COMPLETE_HTML = `<!--render all uploads -->
<ng-container *ngFor="upload of uploads">
    <ngx-fileupload-item [upload]="upload"></ngx-fileupload-item>
</ng-container>

<div class="btn" [ngxFileUploadFile]="'http://example.url/upload'" (add)="onUploadAdd($event)">Add Files</div>
`;

export const LISTING_1_TS = `
import { Component, Input } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-customize--fileselect",
    templateUrl: "fileselect.component.html"
})
export class FileSelectComponent {

    /**
     * uploads to shown in list
     */
    public uploads: Upload[];

    /**
     * register to add event on directive so we know when an upload has been added
     */
    public onUploadAdd(upload: Upload) {
        this.uploads.push(upload);
    }
}`;

const Listing2HTML = `
<button class="btn" [ngxFileUploadFile]="'...'" (add)="..." #uploadRef=ngxFileUploadRef>Add Files</button>
<button class="btn" (click)="uploadRef.uploadAll()">Upload All</button>
...
`;

const Listing2ExampleHtml = `
<ng-container *ngFor="upload of uploads">
    <ngx-fileupload-item [upload]="upload"></ngx-fileupload-item>
</ng-container>

<!-- note the change of url, this will tell our upload interceptor each upload will fail, simulate server error -->
<div class="btn" [ngxFileUploadFile]="'http://example.url/upload/error'" (add)="onUploadAdd($event)" #uploadRef="ngxFileUploadRef">Add Files</div>

<!-- add uploadAll / stop all control -->
<button class="btn" (click)="uploadRef.uploadAll()">Upload All</button>
<button class="btn" (click)="uploadRef.cancelAll()">Stop All</button>
<button class="btn" (click)="uploadRef.cleanAll()">Clean Up</button>
`;

const ListingFinalHtml = `
<ng-container *ngFor="upload of uploads">
    <ngx-fileupload-item [upload]="upload" (completed)="uploadCompleted($event)></ngx-fileupload-item>
</ng-container>

<div class="btn" [ngxFileUploadFile]="'http://example.url/upload/error'" (add)="onUploadAdd($event)" #uploadRef="ngxFileUploadRef">Add Files</div>

<!-- add uploadAll / stop all control -->
<button class="btn" (click)="uploadRef.uploadAll()">Upload All</button>
<button class="btn" (click)="uploadRef.cancelAll()">Stop All</button>
<button class="btn" (click)="uploadRef.cleanAll()">Clean Up</button>
`;

const ListingFinalTS = `
import { Component, Input } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-customize--fileselect",
    templateUrl: "fileselect.component.html"
})
export class FileSelectComponent {

    /**
     * uploads to shown in list
     */
    public uploads: Upload[];

    /**
     * register to add event on directive so we know when an upload has been added
     */
    public onUploadAdd(upload: Upload) {
        this.uploads.push(upload);
    }

    public uploadCompleted(completed: Upload) {
        this.uploads = this.uploads.filter((upload: Upload) => upload !== completed);
    }
}`;

export const Snippets = {
    Listing1: {
        Html: LISTING_1_HTML,
        TS: LISTING_1_TS,
        FULL_HTML: LISTING_1_COMPLETE_HTML
    },
    Listing2: {
        applyRef: Listing2HTML,
        exampleHtml: Listing2ExampleHtml
    },
    ListingFinal: {
        html: ListingFinalHtml,
        ts: ListingFinalTS
    }
};
