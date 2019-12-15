export const TS = `
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { UploadStorage, NgxFileUploadFactory, UploadOptions, UploadRequest, UploadState } from "@ngx-file-upload/core";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: "app-drop-zone",
    templateUrl: "drop-zone.html",
    styleUrls: ["./drop-zone.scss"]
})
export class DropZoneComponent implements OnDestroy, OnInit {

    public uploads: UploadRequest[] = [];

    public uploadStorage: UploadStorage;

    /** UploadState enum so we could use this in template */
    public states = UploadState;

    /** upload options */
    private uploadOptions: UploadOptions = {
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
        this.uploadStorage = new UploadStorage({
            concurrentUploads: 2
        });
    }

    /**
     * files get dropped
     */
    public drop(files: NgxFileDropEntry[]) {
        const requests: UploadRequest[] = [];

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
<!-- SECTION TEMPLATES -->
<ng-template #itemTemplate let-upload="data" let-ctrl="ctrl">
    <div class="upload-item">
        <div class="label"><p>{{upload.name}}</p></div>

        <!-- bootstrap progressbar -->
        <div class="progress">
            <div class="progress-bar" role="progressbar" [ngStyle]="{width: upload.progress + '%'}"></div>
        </div>

        <div class="actions" [ngSwitch]="upload.state">
            <!-- only icons -->
            <span class="state" *ngSwitchCase="states.PENDING"><i class="icon-pending"></i></span>
            <span class="state" *ngSwitchCase="states.START"><i class="icon-connect"></i></span>
            <span class="state" *ngSwitchCase="states.PROGRESS"><i class="icon-progress"></i></span>
            <span class="state" *ngSwitchCase="states.COMPLETED">
                <i [ngClass]="upload.hasError ? 'icon-warning' : 'icon-success'"></i>
            </span>

            <!-- action buttons -->
            <button type="button" class="btn state" *ngSwitchDefault (click)="ctrl.start()">
                <i class="icon-upload"></i>
            </button>
            <button type="button" class="btn state" (click)="ctrl.remove()"><i class="icon-cancel"></i></button>
        </div>
    </div>
</ng-template>

<ngx-fileupload-toolbar [storage]="uploadStorage"></ngx-fileupload-toolbar>

<ngx-file-drop (onFileDrop)="drop($event)"
    [dropZoneLabel]="'Drop or'"
    [dropZoneClassName]="'ngx-fileupload__ngx-file-drop'"
    [showBrowseBtn]="true"
    [browseBtnLabel]="'Browse'">
</ngx-file-drop>

<div class="files">
    <ngx-fileupload-item *ngFor="let upload of uploads" [template]="itemTemplate" [upload]="upload"></ngx-fileupload-item>
</div>
`;
