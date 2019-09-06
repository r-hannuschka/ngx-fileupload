# NgxFileupload

[![npm](https://img.shields.io/npm/v/@r-hannuschka/ngx-fileupload.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@r-hannuschka/ngx-fileupload)
[![CircleCI](https://circleci.com/gh/r-hannuschka/ngx-fileupload/tree/master.svg?style=svg)](https://circleci.com/gh/r-hannuschka/ngx-fileupload/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dc2f1a553c31471a95184d397bf72eb3)](https://www.codacy.com/app/r-hannuschka/ngx-fileupload?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=r-hannuschka/ngx-fileupload&amp;utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/r-hannuschka/ngx-fileupload/branch/master/graph/badge.svg)](https://codecov.io/gh/r-hannuschka/ngx-fileupload)

Angular 8+ async fileupload with progressbar

![ngx-fileupload.gif](./docs/ngx-fileupload.gif)

___

## Contents

- [NgxFileupload](#ngxfileupload)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)
    - [Custom Item Template](#custom-item-template)
    - [Full Customize](#full-customize)
    - [Add Params / Headers to Upload](#add-params--headers-to-upload)
  - [Development](#development)
  - [Tests](#tests)
  - [Credits](#credits)
  - [Author](#author)
  - [Other Modules](#other-modules)

## Installation

npm

```bash
npm i --save @r-hannuschka/ngx-fileupload angular-pipes
```

## Usage

app.module.ts

```js
import { NgModule, Injectable } from "@angular/core";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";

@NgModule({
    imports: [
        ...
        NgxFileUploadModule
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

Upload file directly in post body (no formdata)

```html
    <!-- file will directly sends with POST and not added to FormData Object default is true-->
    <ngx-fileupload [url]="<URL>" [useFormData]="false"></ngx-fileupload>
```

Upload file with form data but custom form data field

```html
    <!-- file will uploaded via FormData with field name myFileUploadField, (default: 'file') -->
    <ngx-fileupload [url]="<URL>" [formDataName]="'myFileUploadField'"></ngx-fileupload>
```

## Examples

### Custom Item Template

if a custom template will be added, it will receive UploadTemplateContext object which contains:  

data:UploadData (current upload informations)

| name | type | description | values |
|---|---|---|---|
| hasError | boolean | flag upload got error | |
| isSuccess | boolean | upload was successfully |
| isValid | boolean | current upload is valid |
| message | string | current error / validation or success message|
| name | string | name of file | |
| progress | number | progress in percent | |
| state | string | current state of upload | canceled, queued, progress, error,  uploaded, invalid|
| size | number | size of file | |
| uploaded | number | uploaded size in byte | |

```html
<ng-template #customItemTemplate let-uploadData="data" ...>
    <h2>{{uploadData.name}}</h2>
    <div>Progress: {{uplodaData.uploaded}}/{{uploadData.size}}
</ng-template>
```

ctrl:UploadControl (start/stop/retry an upload)

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

simply define a *ng-template* tag and pass it to *ngx-fileupload* component

```html
<ng-template #customItemTemplate let-uploadData="data" let-uploadCtrl="ctrl">
    ...
</ng-template>

<ngx-fileupload [url]="<URL>" [itemTemplate]="customItemTemplate"></ngx-fileupload>
```

___

### Full Customize

my.component.ts

```ts
import { FileUpload, UploadModel, UploadState } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "my-component",
    styleUrls: ["./my.component.scss"],
    templateUrl: "my.component.html",
})
export class MyComponent {

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

my.component.html

```html
<!-- 
    define custom item template, if we dont pass a template to 
    ngx-fileupload-item it will take default template as fallback
-->
<ng-template #itemTemplate let-uploadData="data" let-uploadCtrl="ctrl">

    <div class="title">
        {{uploadData.name}}
    </div>

    <div class="actions">
        <button type="button"
            *ngIf="!uploadData.hasError"
            [disabled]="uploadData.invalid || uploadData.state !== 'queued'"
            (click)="uploadCtrl.start()">
            start
        </button>
        <button type="button" (click)="uploadCtrl.cancel()">
            stop
        </button>
    </div>

</ng-template>

<!-- show all uploads -->
<div class="file-upload--list">
    <ng-container *ngFor="let item of uploads">
        <ngx-fileupload-item
            [upload]="item"
            [template]="itemTemplate"
            (changed)="handleUploadChange($event, item)">
        </ngx-fileupload-item>
    </ng-container>
</div>

<!--
    add directive ngxFileUpload to create new uploads if files get dropped here
    or selected from file window.

    optional pass useFormData: boolean (default: true)
    optional pass formDataName: string (default file)
-->
<div class="fileupload dropzone"
    [ngxFileUpload]="url"
    [useFormData]="true"
    [formDataName]="'myFileUpload'"
    (add)="onUploadsAdd($event)"
    #myNgxFileUploadRef="ngxFileUploadRef">

    <span>
        Drop Files or Click to add uploads.
    </span>
</div>

<!-- button, on click use myNgxFileUploadRef to upload all files at once -->
<button class="btn btn-upload" type="button" (click)="myNgxFileUploadRef.uploadAll()">Upload</button>
<button class="btn btn-clear"  type="button" (click)="myNgxFileUploadRef.cleanAll()">Clean Up</button>
<button class="btn btn-cancel" type="button" (click)="myNgxFileUploadRef.cancelAll()">Cancel</button>
```

___

### Add Params / Headers to Upload

To add additional params / headers HTTP Interceptors should be used from angular to modify
request.

upload.interceptor.ts

```ts
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

export class UploadInterceptor implements HttpInterceptor {

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const needle = new RegExp("^/lib/upload");
        if (req.url.match(needle) && req.body.has("file")) {
            const fileName = req.body.get("file").name;
            const request: HttpRequest<any> = req.clone({
                /** add additional params */
                setParams: {
                    "fileName": fileName,
                }
            });
            return next.handle(request);
        }
        return next.handle(req);
    }
}
```

app-upload.module.ts

```ts
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";

@NgModule({
    exports: [ NgxFileUploadModule ],
    imports: [ NgxFileUploadModule ],
    providers: [{
        // ... validators
    }, {
        provide: HTTP_INTERCEPTORS,
        useClass: UploadInterceptor,
        multi: true
    }],
})
export class AppUploadModule { }
```

___

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

## Tests

```bash
# end to end tests
ng e2e

# unit tests
ng test ngx-fileupload
```

## Credits

Special thanks for code reviews, great improvements and ideas to

||||  
|:-:|:-:|:-:|
|[![alt Konrad Mattheis](https://avatars2.githubusercontent.com/u/1100969?s=60&v=4)](https://github.com/konne)<br />Konrad Mattheis| [<img src="https://avatars3.githubusercontent.com/u/17725886?s=60&v=4" width=60 alt="Thomas Haenig" />](https://github.com/thomashaenig)<br />Thomas Haenig| [![alt Alexander Görlich](https://avatars0.githubusercontent.com/u/13659581?s=60&v=4)](https://github.com/AlexanderGoerlich)  <br />Alexander Görlich|

## Author

Ralf Hannuschka [Github](https://github.com/r-hannuschka)

## Other Modules

- [ngx-responsivemenu](https://github.com/r-hannuschka/ngx-responsivemenu)
