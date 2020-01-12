export const HTML = `
<!-- define custom template which should used for each upload -->
<ng-template #itemTemplate let-upload="upload">
    <!--
        @see tab template for full template
    -->
</ng-template>

<div class="mt-3 ">

    <!-- upload toolbar -->
    <div class="btn-toolbar mb-3">
        <div class="input-group ml-auto" ngxFileUpload (add)="drop($event)" >
            <div class="input-group-prepend">
                <div class="input-group-text" id="btnGroupAddon">Files</div>
            </div>
            <input type="text" class="form-control" readonly placeholder="Drag Drop or Click">
        </div>

        <div class="btn-group ml-3">
            <button type="button" class="btn btn-secondary" (click)="uploadAll()">Upload All</button>
            <button type="button" class="btn btn-secondary" (click)="purge()">Clean Up</button>
            <button type="button" class="btn btn-secondary" (click)="stop()">Stop All</button>
        </div>
    </div>

    <!-- fileuploads -->
    <div class="card-list">
        <div class="card-list">
            <ng-container *ngFor="let upload of uploads"
                [ngTemplateOutlet]="itemTemplate"
                [ngTemplateOutletContext]="{upload: upload}">
            </ng-container>
        </div>
    </div>
</div>

`;

export const TYPESCRIPT = `
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { UploadStorage, UploadRequest, UploadState, NgxFileUploadFactory } from "@ngx-file-upload/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ExampleUploadStorage } from "@ngx-fileupload-example/data/base/upload-storage";

@Component({
    selector: "app-customize--item-template",
    templateUrl: "item-template.component.html",
    styleUrls: ["./item-template.component.scss"]
})
export class ItemTemplateComponent implements OnInit, OnDestroy {

    public uploadStates = UploadState;

    public uploads: UploadRequest[] = [];

    public destroy$: Subject<boolean> = new Subject();

    public constructor(
        @Inject(ExampleUploadStorage) public storage: UploadStorage,
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {}

    public ngOnInit() {
        this.storage.change()
            .pipe(takeUntil(this.destroy$))
            .subscribe((requests: UploadRequest[]) => this.uploads = requests);
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
    }

    public uploadAll() {
        this.storage.startAll();
    }

    public purge() {
        this.storage.purge();
    }

    public stop() {
        this.storage.stopAll();
    }

    public cancelUpload(upload: UploadRequest) {
        upload.cancel();
    }

    public removeUpload(upload: UploadRequest) {
        this.storage.remove(upload);
    }

    public startUpload(upload: UploadRequest) {
        upload.start();
    }

    public drop(files: File[]) {
        const uploadOptions: UploadOptions = { url: this.url };
        const requests = this.uploadFactory.createUploadRequest(files, uploadOptions);
        this.storage.add(requests);
    }
}
`;

export const MODULE = `
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule } from '@ngx-file-upload/ui';
import { CustomizeComponent } from "./customize/customize.component";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadUiCommonModule,
        NgxFileUploadUiProgressbarModule,
    ],
    declarations: [ CustomizeComponent ]
})
export class CustomizPage {}
`;


export const TEMPLATE = `
<!-- template for each upload -->
<ng-template #itemTemplate let-upload="upload">

    <div class="card-wrapper">

        <div class="card upload">

            <div class="card-header d-flex justify-content-between align-items-center">
                <span class="title text-truncate">{{upload.data.name}}</span>

                <div class="actions btn-group">
                    <button
                        (click)="startUpload(upload)"
                        class="btn upload btn-sm"
                        [disabled]="upload.data.state !== uploadStates.IDLE" >
                        <i class="icon-left icon-upload"></i>
                    </button>

                    <button (click)="cancelUpload(upload)" [disabled]="!(upload.data.state | isCancelAble)" class="btn cancel btn-sm">
                        <i class="icon-left icon-canceled"></i>
                    </button>

                    <button (click)="removeUpload(upload)" class="btn btn-sm delete">
                        <i class="icon-left icon-cancel"></i>
                    </button>
                </div>
            </div>

            <div class="card-body">
                <div class="progressbar">
                    <ngx-file-upload-ui--progressbar-circle [parts]="2" [progress]="upload.data.progress">
                    </ngx-file-upload-ui--progressbar-circle>
                </div>

                <div class="col details col-auto">
                    <dl>
                        <dt class="label">State</dt>
                        <dd class="value text-truncate">{{upload.data.state | stateToString}}</dd>
                        <dt class="label">Uploaded</dt>
                        <dd class="value text-truncate">{{upload.data.uploaded | fileSize}} / {{upload.data.size | fileSize}}</dd>
                    </dl>
                </div>
            </div>

            <div class="card-footer" *ngIf="upload.isCompleted() || upload.isInvalid()">

                <!-- response completed show error / success -->
                <ng-container *ngIf="upload.data.state === uploadStates.COMPLETED"
                    [ngTemplateOutlet]="upload.data.hasError ? errorTemplate : successTemplate"
                    [ngTemplateOutletContext]="{data: upload.data.hasError ? upload.data.response.errors : upload.data.name}" >
                </ng-container>

                <ng-container *ngIf="upload.data.validationErrors"
                    [ngTemplateOutlet]="invalidTemplate"
                    [ngTemplateOutletContext]="{data: upload.data.validationErrors}" >
                </ng-container>
            </div>
        </div>
    </div>
</ng-template>

<!-- upload error template -->
<ng-template #errorTemplate let-errors="data">
    <ul class="errors">
        <li *ngFor="let error of errors" class="error">{{error}}</li>
    </ul>
</ng-template>

<!-- upload success template -->
<ng-template #successTemplate let-name="data">
    <span class="success">
        {{name}} successful uploaded
    </span>
</ng-template>
`;
