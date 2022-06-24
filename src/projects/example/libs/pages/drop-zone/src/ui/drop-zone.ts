import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { NgxFileUploadStorage, NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadState, INgxFileUploadRequest } from "@ngx-file-upload/core";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import * as ExampleCodeData from "projects/example/libs/data/code/ngx-drop-zone/drop-zone";

@Component({
  selector: "app-drop-zone",
  templateUrl: "drop-zone.html",
  styleUrls: ["./drop-zone.scss"]
})
export class DropZoneComponent implements OnDestroy, OnInit {

  public uploads: INgxFileUploadRequest[] = [];

  public uploadStorage: NgxFileUploadStorage;

  public code = ExampleCodeData;

  public states = NgxFileUploadState;

  /** upload options */
  private uploadOptions: NgxFileUploadOptions = {
    url: "http://localhost:3000/upload/gallery",
    formData: {
      enabled: true,
      name: "picture",
      additionalData: {
        'token': 'foobar'
      }
    },
  };

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
  ) {
    this.uploadStorage = new NgxFileUploadStorage({
      concurrentUploads: 1
    });
  }

  /**
   * files get dropped
   */
  public drop(files: NgxFileDropEntry[]) {
    const sources: File[] = []

    files.forEach((file) => {
      if (file.fileEntry.isFile) {
        const dropped = file.fileEntry as FileSystemFileEntry;
        dropped.file((droppedFile: File) => {
          if (droppedFile instanceof DataTransferItem) {
            return;
          }
          sources.push(droppedFile);
        });
      }
    });

    const request = this.uploadFactory.createUploadRequest(sources, this.uploadOptions);
    if (request) {
      this.uploadStorage.add(request);
    }
  }

  public ngOnInit() {
    this.uploadStorage.change()
      .pipe(takeUntil(this.destroy$))
      .subscribe((uploads) => this.uploads = uploads);
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();

    this.uploadStorage.destroy();
  }
}
