import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { UploadStorage, NgxFileUploadFactory, UploadOptions, UploadState, UploadRequest } from "../ngx-fileupload/public-api";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/ngx-drop-zone/drop-zone";

@Component({
    selector: "app-drop-zone",
    templateUrl: "drop-zone.html",
    styleUrls: ["./drop-zone.scss"]
})
export class DropZoneComponent implements OnDestroy, OnInit {

    public uploads: UploadRequest[] = [];

    public uploadStorage: UploadStorage;

    public code = ExampleCodeData;

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
