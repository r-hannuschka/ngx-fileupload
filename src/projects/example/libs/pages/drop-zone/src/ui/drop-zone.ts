import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { NgxFileUploadStorage, NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadState, NgxFileUploadRequest } from "@ngx-file-upload/core";
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

  public uploads: NgxFileUploadRequest[] = [];

  public uploadStorage: NgxFileUploadStorage;

  public code = ExampleCodeData;

  public states = NgxFileUploadState;

  /** upload options */
  private uploadOptions: NgxFileUploadOptions = {
    url: "http://localhost:3000/upload/gallery",
    formData: {
      enabled: true,
      name: "picture",
      metadata: {
        role: 'DEV_NULL',
        parent: -1
      }
    },
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

          /**
           * second file
           */
          const blobParts = Array.from(new Array(1000)).map(() => 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.');
          const f = new File(blobParts, 'file2.txt');

          requests.push(this.uploadFactory.createUploadRequest([droppedFile, f], this.uploadOptions) as unknown as NgxFileUploadRequest);
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

    this.uploadStorage.destroy();
  }
}
