# ngx file upload / core

[![npm](https://img.shields.io/npm/v/@ngx-file-upload/core.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@ngx-file-upload/core)
![](https://github.com/r-hannuschka/ngx-fileupload/workflows/ngx-file-upload/core/badge.svg?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dc2f1a553c31471a95184d397bf72eb3)](https://www.codacy.com/app/r-hannuschka/ngx-fileupload?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=r-hannuschka/ngx-fileupload&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/6017/projects/7879/branches/86957/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6017&pid=7879&bid=86957)
[![codecov](https://codecov.io/gh/r-hannuschka/ngx-fileupload/branch/master/graph/badge.svg)](https://codecov.io/gh/r-hannuschka/ngx-fileupload)
[![dependencies Status](https://david-dm.org/r-hannuschka/ngx-fileupload/status.svg?path=src)](https://david-dm.org/r-hannuschka/ngx-fileupload?path=src)

Angular 9+ file upload core files for asynchronous file upload. This package does not contain any UI components in order to stay as small as possible and to guarantee the freedom to design the entire surface yourself without bringing the overhead of styles, images and fonts that are not required.

This library contains

- Storage to store all uploads and used them app wide or only in component.
- A queue to limit the number of active uploads and upload more later. 
- Validation
- ansychronous file uploads with live progress update.

### Angular 9

This package is build with angular 9 and typescript ^3.7.5 which is not supported by angular 8 by default. Typings for 3.5.5 and 3.7.5 are diffrent, if u want use this package in Angular 8 Project update your Angular 8 Project to Typescript ^3.7.5.

We also change all namespaces to have NgxFileUpload as prefix [@see breaking change 1.1.2 to 2.0.0](https://github.com/r-hannuschka/ngx-fileupload/commit/3bcf0be5d36609215af28bdeac7961e4602f88ad)


### Angular 8

For Angular 8 [ngx-file-upload/core v1.1.2](https://www.npmjs.com/package/@ngx-file-upload/core/v/1.1.2), compiled with typescript 3.5.x which is used default by angular 8.

### @Install

```bash
npm i --save @ngx-file-upload/core
```

### @Example

This example uses ngx-dropzone module which also provides some ui components for a drop zone and preview. We could simply use this and put our own stuff on top of this.

- only 2 Uploads on same time all other will queued
- all uploads will persist in storage, so we have an provider we could on other components to get current uploads.
- uploads will start automatically if they put into queue
- uploads will removed automatically after 5 seconds if they completed

#### app.module.ts

```ts
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule, Provider } from "@angular/core";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxDropzoneModule } from "ngx-dropzone";

import { AppComponent } from "./app.component";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        // app module
        CommonModule
        NgxDropzoneModule,
        NgxFileUploadCoreModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

---

#### app.component.ts

```ts
import { Component, OnInit, Inject } from '@angular/core';
import { NgxFileUploadStorage, NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadRequest } from "@ngx-file-upload/core";

@Component({
    selector: "app-component",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    public uploads: NgxFileUploadRequest[] = [];

    private storage: NgxFileUploadStorage;

    private uploadOptions: NgxFileUploadOptions;

    constructor(
      @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.storage = new NgxFileUploadStorage({
          concurrentUploads: 2,
          autoStart: true,
          removeCompleted: 5000 // remove completed after 5 seconds
        });

        this.uploadOptions = {url: "http://localhost:3000/gallery/add"};
    }

    ngOnInit() {
      this.storage.change()
        .subscribe(uploads => this.uploads = uploads);
    }
 
    public onSelect(event) {
      const addedFiles: File[] = event.addedFiles;

      if (addedFiles.length) {
        const uploads = this.uploadFactory.createUploadRequest(addedFiles, this.uploadOptions);
        this.storage.add(uploads);
      }
    }
     
    public onRemove(upload: NgxFileUploadRequest) {
      this.storage.remove(upload);
    }
}
```

---

#### app.component.html

For uploading images

```html
<ngx-dropzone (change)="onSelect($event)">
	<ngx-dropzone-label>Drop or Browse</ngx-dropzone-label>
	<ngx-dropzone-image-preview ngProjectAs="ngx-dropzone-preview" *ngFor="let upload of uploads"
		(removed)="onRemove(upload)" 
		[file]="upload.data.raw"
    [removable]="true"
  >
    <ngx-dropzone-label>
        Name: {{ upload.data.name }}<br />
        State: {{upload.data.state}}<br />
        Progress: {{upload.data.progress}}%
    </ngx-dropzone-label>

  </ngx-dropzone-image-preview>
</ngx-dropzone>
```

### @Demo

[Demo](https://r-hannuschka.github.io/ngx-fileupload/#/) can be found here.

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

