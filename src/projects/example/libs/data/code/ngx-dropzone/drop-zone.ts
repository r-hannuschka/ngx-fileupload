export const MODULE = `
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule, NgxFileUploadUiToolbarModule } from "@ngx-file-upload/ui";
import { NgxDropZoneDemoComponent } from "./ngx-dropzone";

@NgModule({
    imports: [
        CommonModule,
        NgxDropzoneModule,
        /**
         * !notice required import of NgxFileUploadCoreModule only in root of app
         */
        NgxFileUploadCoreModule,
        /**
         * NgxFileUploadUiCommonModule for pipes
         * NgxFileUploadUiProgressbarModule for circle progressbar
         * NgxFileUploadUiToolbarModule for toolbar
         */
        NgxFileUploadUiCommonModule,
        NgxFileUploadUiProgressbarModule,
        NgxFileUploadUiToolbarModule
    ])],
    declarations: [NgxDropZoneDemoComponent]
})
export class AppModule { }
`;

export const TS = `
import { Component, OnInit, Inject } from "@angular/core";
import { NgxFileUploadStorage, NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadRequest } from "@ngx-file-upload/core";

@Component({
    selector: "app-ngx-dropzone-demo",
    templateUrl: "./ngx-dropzone.html",
    styleUrls: ["./ngx-dropzone-demo.scss"]
})
export class NgxDropZoneDemoComponent implements OnInit {

    public uploads: NgxFileUploadRequest[] = [];

    public storage: NgxFileUploadStorage;

    private uploadOptions: NgxFileUploadOptions;

    constructor(
      @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.storage = new NgxFileUploadStorage({
          concurrentUploads: 2,
          autoStart: true,
          removeCompleted: 5000 // remove completed after 5 seconds
        });
        this.uploadOptions = {url: "http://localhost:3000/upload"};
    }

    ngOnInit() {
        this.storage.change()
          .subscribe(uploads => this.uploads = uploads);
    }

    public onSelect(event) {
      const addedFiles: File[] = event.addedFiles;
      const uploads = this.uploadFactory.createUploadRequest(addedFiles, this.uploadOptions);
      this.storage.add(uploads);
    }

    public onRemove(upload: NgxFileUploadRequest) {
      this.storage.remove(upload);
    }

    public startUploads() {
      this.storage.startAll();
    }
}
`;

export const HTML = `
<ngx-file-upload-ui--toolbar [storage]="storage"></ngx-file-upload-ui--toolbar>
<ngx-dropzone (change)="onSelect($event)" [accept]="'image/*'">
    <ngx-dropzone-label>Drop or Browse</ngx-dropzone-label>

    <ngx-dropzone-image-preview ngProjectAs="ngx-dropzone-preview" *ngFor="let upload of uploads"
        (removed)="onRemove(upload)" [file]="upload.data.files[0].raw" [removable]="true">

        <ngx-dropzone-label>
            <span class="state">
                State: {{upload.data.state | stateToString }}
            </span>

            <!-- add progressbar -->
            <ngx-file-upload-ui--progressbar-circle [progress]="upload.data.progress" [parts]="12" >
            </ngx-file-upload-ui--progressbar-circle>

            <span class="label">
                {{ upload.data.name }}
            </span>
        </ngx-dropzone-label>
    </ngx-dropzone-image-preview>
</ngx-dropzone>
`;

export const SCSS = `
:host {
    ngx-dropzone {
        border-style: solid;
        border-width: 0 2px 2px;
        border-radius: 0;
        padding: .2rem .5rem .2rem 0;
    }

    ngx-dropzone-image-preview {
        height: 100%;
        position: relative;
        margin: 0 .5rem 0 0;
    }

    ngx-dropzone-label {
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        span {
            color: #FFF;
            padding: 0 .3rem;
            text-align: left;
        }

        span.label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    ngx-file-upload-ui--progressbar-circle {

        ::ng-deep {

            svg {
                opacity: .8;
                height: 72px;
                width: 72px;
            }

            svg circle {
                stroke: darken(#FFF, 50%);
                stroke-width: .5rem;

                &.progress {
                    stroke-width: .5rem;
                    stroke: #FFF;
                }
            }

            span {
                font-size: .7rem;
                color: #FFF;
            }
        }
    }

    ::ng-deep {

        ngx-dropzone-remove-badge {
            z-index: 10;
        }
    }
}

`;
