# ngx file upload / core

[![npm](https://img.shields.io/npm/v/@ngx-file-upload/core.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@ngx-file-upload/core)
![](https://github.com/r-hannuschka/ngx-fileupload/workflows/ngx-file-upload/core/badge.svg?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dc2f1a553c31471a95184d397bf72eb3)](https://www.codacy.com/app/r-hannuschka/ngx-fileupload?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=r-hannuschka/ngx-fileupload&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/6017/projects/7879/branches/86957/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6017&pid=7879&bid=86957)
[![codecov](https://codecov.io/gh/r-hannuschka/ngx-fileupload/branch/master/graph/badge.svg)](https://codecov.io/gh/r-hannuschka/ngx-fileupload)
[![dependencies Status](https://david-dm.org/r-hannuschka/ngx-fileupload/status.svg?path=src)](https://david-dm.org/r-hannuschka/ngx-fileupload?path=src)
[![youtube how tow](https://raw.githubusercontent.com/r-hannuschka/ngx-fileupload/master/bin/youtube.badge.svg)](https://www.youtube.com/watch?v=_dLyu2wceak&list=PL8Y_IacQr6GLyAVCQ12g5J04cY1DL0eSI&index=1)

Angular 16 file upload core files for asynchronous file upload. This package does not contain any UI components in order to stay as small as possible and to guarantee the freedom to design the entire surface yourself without bringing the overhead of styles, images and fonts that are not required.

This library contains

- Storage to store all uploads and used them app wide or only in component.
- A queue to limit the number of active uploads and upload more later. 
- Validation
- ansychronous file uploads with live progress update.

## Versions 

- angular@16 - 8.x.x
- angular@15 - 7.x.x
- angular@14 - 6.x.x
- angular@13 - 5.x.x 
- angular@12 - 4.x.x

## Version 4

- supports now upload of multiple files per request
- fixed some performance issues

### breaking changes

- NgxFileUploadFactory returns now only one request with all filles which are passed
- renamed NgxFileUpload to NgxFileUploadRequest
- NgxFileUpload.data.name now returns an array of file names which are added to the request
- added NgxFileUpload.data.files: INgxFileUploadFile[]

## Version 3

- update angular to version 12

### Angular 9

Use [ngx-file-upload/ui v2.2.1](https://www.npmjs.com/package/@ngx-file-upload/ui/v/2.2.1).

This package is build with angular 9 and typescript ^3.7.5 which is not supported by angular 8 by default. Typings for 3.5.5 and 3.7.5 are diffrent, if u want use this package in Angular 8 Project update your Angular 8 Project to Typescript ^3.7.5.

We also change all namespaces to have NgxFileUpload as prefix [@see breaking change 1.1.2 to 2.0.0](https://github.com/r-hannuschka/ngx-fileupload/commit/3bcf0be5d36609215af28bdeac7961e4602f88ad)


### Angular 8

For Angular 8 [ngx-file-upload/core v1.1.2](https://www.npmjs.com/package/@ngx-file-upload/core/v/1.1.2), compiled with typescript 3.5.x which is used default by angular 8.

### @Install

```bash
npm i --save @ngx-file-upload/core
```

## @Example

### NgxFileDrop

For this example we use [ngx-file-drop](https://www.npmjs.com/package/ngx-file-drop) library for drag and drop which can also handles drag n drop directories.

#### app.module.ts

```ts
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule, NgxFileUploadUiToolbarModule } from "@ngx-file-upload/ui";
import { NgxFileDropModule } from "ngx-file-drop";
import { DropZoneComponent } from "./ui/drop-zone";

@NgModule({
  imports: [
    CommonModule,
    NgxFileUploadUiToolbarModule,
    NgxFileUploadUiProgressbarModule,
    NgxFileUploadUiCommonModule,
    NgxFileDropModule,
  ])],
  declarations: [DropZoneComponent],
  entryComponents: [DropZoneComponent],
  providers: [],
})
export class DropZone { }
```

---

#### app.component.ts

```ts
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { 
  NgxFileUploadStorage,
  NgxFileUploadFactory,
  NgxFileUploadOptions,
  NgxFileUploadState,
  INgxFileUploadRequest
} from "@ngx-file-upload/core";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-drop-zone",
  templateUrl: "drop-zone.html"
})
export class DropZoneComponent implements OnDestroy, OnInit {

  uploads: INgxFileUploadRequest[] = [];
  uploadStorage: NgxFileUploadStorage;
  code = ExampleCodeData;
  states = NgxFileUploadState;

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
    this.uploadStorage = new NgxFileUploadStorage({ concurrentUploads: 1 });
  }

  drop(files: NgxFileDropEntry[]) {
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

    // * upload all dropped files into one request
    const request = this.uploadFactory.createUploadRequest(sources, this.uploadOptions);
    /**
     * alternate push multiple requests at once, or add them later to storage
     *
     * @example
     * 
     * const requests: INgxFileUploadRequest[] = []
     * 
     * do {
     *   const toUpload = files.splice(0, 3)
     *   requests.push(this.uploadFactory.createUploadRequest(sources, this.uploadOptions))
     * } while (files.length)
     * 
     * storage.add(requests)
     */
    if (request) {
      this.uploadStorage.add(request);
    }
  }

  ngOnInit() {
    this.uploadStorage.change()
      .pipe(takeUntil(this.destroy$))
      .subscribe((uploads) => this.uploads = uploads);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.uploadStorage.destroy();
  }
}
```

---

#### app.component.html

```html
<!-- requires @ngx-file-upload/ui package -->
<ngx-file-upload-ui--toolbar [storage]="uploadStorage"></ngx-file-upload-ui--toolbar>

<ngx-file-drop (onFileDrop)="drop($event)" [dropZoneLabel]="'Drop or'"
  [dropZoneClassName]="'ngx-fileupload__ngx-file-drop'" [showBrowseBtn]="true" [browseBtnLabel]="'Browse'">
</ngx-file-drop>

<div class="files">
  <div *ngFor="let upload of uploads" class="upload">
      <div class="data">
          <span class="name">{{upload.data.name}}</span>
          <span class="uploaded">
            {{upload.data.uploaded | fileSize}} | {{upload.data.size | fileSize}} | {{upload.data.progress}}%
          </span>
          <span class="state">{{upload.data.state | stateToString}}</span>
      </div>

      <ngx-file-upload-ui--progressbar [progress]="upload.data.progress" [parts]="5" [gap]="1" [duration]="100">
      </ngx-file-upload-ui--progressbar>
  </div>
</div>
```

## @Demo

[Demo](https://r-hannuschka.github.io/ngx-fileupload/#/) can be found here.

### @ngx-file-upload/ui

for some ui components like progressbars, toolbars, drop-zone or full item template

[![](https://github.com/r-hannuschka/ngx-fileupload/workflows/ngx-file-upload/ui/badge.svg?branch=master)](https://github.com/r-hannuschka/ngx-fileupload/tree/master/src/projects/ui) [![npm](https://img.shields.io/npm/v/@ngx-file-upload/ui.svg?maxage=2592000?style=plastic)](https://www.npmjs.com/package/@ngx-file-upload/ui)

### @Docs

|Name          | Short Description                                                         | Docs                                                                                               |
|--------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
|API| all interfaces   | [API](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/core/api.md)|
|Upload Storage| simple upload storage which holds all upload requests and controls them   | [Upload Storage](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/core/upload.storage.md)|
|Upload Factory| factory to create new upload requests which can added to upload storage   | [Upload Factory](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/core/factory.md) | 
|Upload Queue  | part of upload storage and controls how many uploads run at the same time | - |
|Validation    | Validation Classes for upload requests                                    | [Vaidation](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/core/validation.md)|

### @ngx-file-upload/ui

[![](https://github.com/r-hannuschka/ngx-fileupload/workflows/ngx-file-upload/ui/badge.svg?branch=master)](https://github.com/r-hannuschka/ngx-fileupload/tree/master/src/projects/ui) [![npm](https://img.shields.io/npm/v/@ngx-file-upload/ui.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@ngx-file-upload/ui)

### @Credits

Special thanks for code reviews, great improvements and ideas to

||||  
|:-:|:-:|:-:|
|[![alt Konrad Mattheis](https://avatars2.githubusercontent.com/u/1100969?s=60&v=4)](https://github.com/konne)<br />Konrad Mattheis| [<img src="https://avatars3.githubusercontent.com/u/17725886?s=60&v=4" width=60 alt="Thomas Haenig" />](https://github.com/thomashaenig)<br />Thomas Haenig| [![alt Alexander Görlich](https://avatars0.githubusercontent.com/u/13659581?s=60&v=4)](https://github.com/AlexanderGoerlich)  <br />Alexander Görlich|

### Author

Ralf Hannuschka [Github](https://github.com/r-hannuschka)

### Other Modules

- [ngx-responsivemenu](https://github.com/r-hannuschka/ngx-responsivemenu)

