export const MODULE = `
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule, NgxFileUploadUiToolbarModule } from "@ngx-file-upload/ui";
import { NgxFileDropModule } from "ngx-file-drop";

import { DropZoneComponent } from "./ui/drop-zone";

@NgModule({
    imports: [
        CommonModule,
        NgxFileDropModule,
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
    declarations: [DropZoneComponent],
    providers: [],
})
export class DropZone { }
`;


export const TS = `
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { NgxFileUploadStorage, NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadRequest, NgxFileUploadState } from "@ngx-file-upload/core";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: "app-drop-zone",
    templateUrl: "drop-zone.html",
    styleUrls: ["./drop-zone.scss"]
})
export class DropZoneComponent implements OnDestroy, OnInit {

    public uploads: NgxFileUploadRequest[] = [];

    public uploadStorage: NgxFileUploadStorage;

    /** NgxFileUploadState enum so we could use this in template */
    public states = NgxFileUploadState;

    /** upload options */
    private uploadOptions: NgxFileUploadOptions = {
        url: "http://localhost:3000/upload/gallery",
        formData: {
            enabled: true,
            name: "picture"
        }
    };

    private destroy$: Subject<boolean> = new Subject();

    constructor(
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.uploadStorage = new NgxFileUploadStorage({
            concurrentUploads: 2
        });
    }

    /**
     * files get dropped
     */
    public drop(files: NgxFileDropEntry[]) {
        const requests: NgxFileUploadRequest[] = [];

        let required = files.length;
        let get = 0;

        files.forEach((file) => {
            if (file.fileEntry.isFile) {
                const dropped = file.fileEntry as FileSystemFileEntry;

                dropped.file((droppedFile: File) => {

                    if (droppedFile instanceof DataTransferItem) {
                        required -= 1;
                        return;
                    }

                    requests.push(this.uploadFactory.createUploadRequest(droppedFile, this.uploadOptions));
                    get += 1;

                    if (get === required) {
                        this.uploadStorage.add(requests);
                    }
                });
            }
        });
    }

    public ngOnInit() {
        this.uploadStorage.change()
            .pipe(takeUntil(this.destroy$))
            .subscribe((uploads) => this.uploads = uploads);
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;

        this.uploadStorage.destroy();
        this.uploadStorage = null;
    }
}
`;

export const HTML = `
<ngx-file-upload-ui--toolbar [storage]="uploadStorage"></ngx-file-upload-ui--toolbar>

<ngx-file-drop (onFileDrop)="drop($event)"
    [dropZoneLabel]="'Drop or'"
    [dropZoneClassName]="'ngx-fileupload__ngx-file-drop'"
    [showBrowseBtn]="true"
    [browseBtnLabel]="'Browse'">
</ngx-file-drop>

<div class="files">
    <div *ngFor="let upload of uploads" class="upload">
        <div class="data">
            <span class="name">{{upload.data.name}}</span>
            <span class="uploaded">{{upload.data.uploaded | fileSize}} | {{upload.data.progress}}%</span>
            <span class="state">{{upload.data.state | stateToString}}</span>
        </div>

        <ngx-file-upload-ui--progressbar [progress]="upload.data.progress" [parts]="5" [gap]="1">
        </ngx-file-upload-ui--progressbar>
    </div>
</div>
`;

export const SCSS = `
:host {

    .files {
        height: 30vh;
        overflow-y: auto;
        padding: 0 1rem;
        border: 1px solid map-get($colors, darkBlue);
        border-top-width: 0;

        .upload {
            margin: 0 0 1rem;
            &:last-child { margin: 0; }
        }

        .upload .data {
            display: flex;

            span:first-child:after {
                content: "";
                border: 1px solid map-get($colors, darkBlue);
                border-width: 0 1px 0 0;
                margin: 0 0 0 .5rem;
            }

            span:nth-child(2) {
                margin: 0 .5rem;
            }

            .uploaded {
                flex: 1;
            }
        }
    }

    ::ng-deep {
        .ngx-fileupload__ngx-file-drop {
            border: 1px solid map-get($colors, darkBlue);

            .ngx-file-drop__content {
                height: auto;
                padding: 1rem;
            }
        }

        .ngx-file-drop__drop-zone-label {
            margin-right: .4rem;
        }
    }
}
`;
