# NgxFileupload

[![npm](https://img.shields.io/npm/v/@r-hannuschka/ngx-fileupload.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@r-hannuschka/ngx-fileupload)

Angular 8+ async fileupload with progressbar

![ngx-fileupload.gif](./docs/ngx-fileupload.gif)
___

## Table of Contents

[Installation](#installation)  
[Usage](#usage)  
[Examples](#Examples)
[Changelog](#Changelog)  

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

__UploadTemplateContext__

*data*

informations arround the uploaded file

| name | type | description | values |
|---|---|---|---|
| hasError | boolean | flag upload got error | |
| isSuccess | boolean | upload was successfully |
| isValid | boolean | current upload is valid |
| message | string | current error / validation or success message|
| name | string | name of file | |
| progress | number | progress in percent | |
| size | number | size of file | |
| state | string | current state of upload | canceled, queued, progress, error,  uploaded, invalid|
| uploaded | number | uploaded size in byte | |

*ctrl*

remote control to start stop a single upload

```html
<ng-template #customItemTemplate ... let-uploadCtrl="ctrl">
    <!-- retry failed upload -->
    <button type="button" *ngIf="data.hasError" (click)="uploadCtrl.retry()">retry</button>

    <!-- start current upload -->
    <button type="button" *ngIf="!data.hasError" (click)="uploadCtrl.start()">start</button>

    <!-- cancel / remove current upload -->
    <button type="button" (click)="uploadCtrl.cancel()">stop</button>
</ng-template>
```

## Examples

### Custom item template

```html
<ng-template #customItemTemplate let-uploadData="data" let-uploadCtrl="ctrl">
    <h2>{{uploadData.name}}/{{uploadData.state}}</h2>
    <button type="button" (click)="uploadCtrl.cancel()">stop</button>
</ng-template>

<ngx-fileupload [url]="<URL>" [itemTemplate]='customItemTemplate'></ngx-fileupload>
```

### Full Customize

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
<button class="btn-upload" type="button" (click)="myNgxFileuploadRef.uploadAll()">Upload</button>
```

### Validators

*validators/max-size.validator.ts*/

```ts
import {
    NgxFileuploadValidation,
    ValidationResult
} from '@r-hannuschka/ngx-fileupload/public-api';

export class MaxUploadSizeValidator implements NgxFileuploadValidator {

    /**
     * validate max upload size to 1MB
     */
    public validate(file: File): ValidationResult {
        const valid = (file.size / (1024 * 1024)) < 1;
        const error = !valid ? 'Max file size 1MByte' : '';
        return { valid, error };
    }
}
```

*app-upload.module.ts*

We create a own module for validation to keep main module clean, you can add as many validators you want if needed. If no Validators are passed all files will uploaded to server.

```ts
import { NgModule } from '@angular/core';
import { 
    NgxFileuploadModule,
    NGX_FILEUPLOAD_VALIDATOR 
} from '@r-hannuschka/ngx-fileupload/public-api';
import { MaxUploadSizeValidator } from './validators/max-size.validator';

@NgModule({
    exports: [ NgxFileuploadModule ],
    imports: [ NgxFileuploadModule ],
    providers: [{
        provide: NGX_FILEUPLOAD_VALIDATOR,
        useClass: MaxUploadSizeValidator,
        multi: true
    }, {
        provide: NGX_FILEUPLOAD_VALIDATOR,
        useClass: SomeOtherValidator,
        multi: true
    }],
})
export class AppUploadModule { }
```

*app.module.ts*

simply import AppUploadModule into main module

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppUploadModule } from './app-upload.module';

@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        AppUploadModule,
        BrowserModule
    ],
    bootstrap: [AppComponent],
} )
export class AppModule { }
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

## Changelog

**0.3.0**  

  - __breaking changes__:  
    - remove *UploadTemplateContext.data.error*, if an error occurs  
    it is written now to *UploadTemplateContext.data.message*

  - __features__
    - validation providers could now defined
    - write upload response data to upload model
  
  - __other changes__
    - show notifications for error / invalid / completed
    - update scss / upload-item template

**0.2.1**  

- __bugfixes__
  - fixed docs

**0.2.0**  

- __breaking changes__:  
  - ngxFileUploadDirective, upload renamed to uploadAll, cancel renamed to cancelAll

- __features__:
  - on error, upload will not completed anymore instead a retry button will shown
  - add UploadControl.retry(), if upload failed it could be uploaded

  ```html
  <!-- insert own retry button in custom template -->
  <ng-template let-uploadData="data" let-uploadCtrl="ctrl">
      <button *ngIf="data.hasError" (click)="uploadCtrl.retry()">retry</button>
  </ng-template>
  ```

  - update item template, add new button upload (@see uploadCtrl.start())
  - css changes
  - add more documentaion

- __bugfixes__
  - ngxFileuploadDirective cancel(All) not working correctly

## @Progress

- theming
- unit tests
- e2e tests

## Author

Ralf Hannuschka [Github](https://github.com/r-hannuschka)

## Other Modules

- [ngx-responsivemenu](https://github.com/r-hannuschka/ngx-responsivemenu)
