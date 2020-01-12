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
         * !notice import of NgxFileUploadCoreModule only required in root of app
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
import { UploadStorage, NgxFileUploadFactory, UploadOptions, UploadRequest } from "@ngx-file-upload/core";

@Component({
    selector: "app-ngx-dropzone-demo",
    templateUrl: "./ngx-dropzone.html",
    styleUrls: ["./ngx-dropzone-demo.scss"]
})
export class NgxDropZoneDemoComponent implements OnInit {

    public uploads: UploadRequest[] = [];

    public storage: UploadStorage;

    private uploadOptions: UploadOptions;

    constructor(
      @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.storage = new UploadStorage({
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

    public onRemove(upload: UploadRequest) {
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
        (removed)="onRemove(upload)"
        [file]="upload.data.raw"
        [removable]="true">
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
                /**
                 * !important set width and height for svg it will rotatet by -90deg
                 * the circle starts on top and not right. So ensure height and width are equal.
                 */
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
