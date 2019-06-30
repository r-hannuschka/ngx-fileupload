# @r-hannuschka/ngx-fileupload

[![npm](https://img.shields.io/npm/v/@r-hannuschka/ngx-fileupload.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@r-hannuschka/ngx-fileupload)

Angular 8+ async fileupload with progressbar

![ngx-fileupload.gif](https://raw.githubusercontent.com/r-hannuschka/ngx-fileupload/master/docs/ngx-fileupload.gif)
___

## Table of Contents

-[Installation](#installation)  
-[Usage](#usage)  

## Installation

npm

```bash
npm i --save @r-hannuschka/ngx-fileupload angular-pipes
```

## Usage

app.module.ts

```js
import { NgModule, Injectable } from '@angular/core';
import { NgxFileuploadModule } from 'lib/public-api';

@NgModule({
    imports: [
        ...
        NgxFileuploadModule
    ],
    exports: [...],
    declarations: [...]
})
export class AppModule { }
```

app.component.html

```html
<ngx-fileupload [url]="<URL>"></ngx-fileupload>
```

### custom item template

```html
<ng-template #customItemTemplate let-uploadData="data" let-uploadCtrl="ctrl">
    <h2>{{uploadData.name}}/{{uploadData.state}}</h2>
    <button type="button" (click)="uploadCtrl.cancel()">stop</button>
</ng-template>

<ngx-fileupload [url]="<URL>" [itemTemplate]='customItemTemplate'></ngx-fileupload>
```

__Scope Variables__

*data*

informations arround the uploaded file

| name | type | description | values |
|---|---|---|---|
| state | string | current state of upload | canceled, queued, progress, error,  uploaded|
| uploaded | number | uploaded size in byte | |
| size | number | size of file | |
| name | string | name of file | |
| progress | number | progress in percent | |
| hasError | boolean | flag upload got error | |
| error | string | current error message | |

*ctrl*

remote control to start stop a download

```html
<ng-template #customItemTemplate ... let-uploadCtrl="ctrl">
    <!-- start current download -->
    <button type="button" (click)="uploadCtrl.start()">start</button>

    <!-- stop current download -->
    <button type="button" (click)="uploadCtrl.cancel()">stop</button>
</ng-template>
```

### full customization

cool.component.ts

```ts
import { FileUpload } from '../services/file-upload';
import { UploadModel, UploadState } from '../model/upload';

@Component({
    selector: 'my-cool-component',
    styleUrls: ['./cool.component.scss'],
    templateUrl: 'cool.component.html',
})
export class MyCoolComponent {

    /**
     * all file uploades, which will be added to upload-item view
     */
    public uploads: FileUpload[] = [];

    /**
     * new uploads added with drag and drop
     */
    public onUploadsAdd( uploads: FileUpload[] ) {
        this.uploads.push( ...uploads );
    }

    /**
     * handle upload change event,
     * if upload has been completed or canceled remove it from list
     */
    public handleUploadChange( upload: UploadModel, fileUpload: FileUpload ) {
        let completed = upload.state === UploadState.CANCELED;
        completed = completed || upload.state === UploadState.UPLOADED;

        if ( completed ) {
            const idx = this.uploads.indexOf(fileUpload);
            this.uploads.splice( idx, 1 );
        }
    }
}
```

cool.component.html

```html
<div class="file-upload--list">
    <!--
        list to show all current files which should uploaded
        pass upload container (item) to file upload view ngx-fileupload-item
        to register on upload changes

        optional: add custom template
    -->
    <ng-container *ngFor="let item of uploads">
        <ngx-fileupload-item
            [upload]="item"
            [template]="itemTemplate"
            (changed)="handleUploadChange($event, item)">
        </ngx-fileupload-item>
    </ng-container>
</div>
<!--
    add directive ngxFileUpload to any container, if you drop files here
    it will generate a file upload container for each file wich has
    been added
-->
<div class="fileupload dropzone"
    [ngxFileupload]="url"
    (add)="onUploadsAdd($event)"
    #myNgxFileuploadRef='ngxFileuploadRef'>
</div>

<!-- button, on click use myNgxFileuploadRef to upload all files at once -->
<button class="btn-upload" type="button" (click)="myNgxFileuploadRef.upload()">Upload</button>
```

## Development

```bash
git clone https://github.com/r-hannuschka/ngx-fileupload
cd ngx-fileupload\src
npm i

# run simple express server for minimized rest api
# listen on localhost:3000
node src\server\upload-server.js

# start webpack server (angular app)
# listen on localhost:4200
npm start
```

## @Progress

- validation: max file size
- validation: allowed files
- theming
- unit tests
- e2e tests

## Author

Ralf Hannuschka [Github](https://github.com/r-hannuschka)

## Other Modules

- [ngx-responsivemenu](https://github.com/r-hannuschka/ngx-responsivemenu)

