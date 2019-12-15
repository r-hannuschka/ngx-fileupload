
# ngx file upload / core

[![npm](https://img.shields.io/npm/v/@ngx-file-upload/ui.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@ngx-file-upload/ui)
![](https://github.com/r-hannuschka/ngx-fileupload/workflows/ngx-file-upload/ui/badge.svg?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/dc2f1a553c31471a95184d397bf72eb3)](https://www.codacy.com/app/r-hannuschka/ngx-fileupload?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=r-hannuschka/ngx-fileupload&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/6017/projects/7879/branches/86957/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6017&pid=7879&bid=86957)
[![codecov](https://codecov.io/gh/r-hannuschka/ngx-fileupload/branch/master/graph/badge.svg)](https://codecov.io/gh/r-hannuschka/ngx-fileupload)
[![dependencies Status](https://david-dm.org/r-hannuschka/ngx-fileupload/status.svg?path=src)](https://david-dm.org/r-hannuschka/ngx-fileupload?path=src)

Angular 8 components for @ ngx-file-upload / core to create a UI. All components were packed in separate modules which can be integrated and used separately as required.

### @dependencies

[![](https://github.com/r-hannuschka/ngx-fileupload/workflows/ngx-file-upload/core/badge.svg?branch=master)](https://github.com/r-hannuschka/ngx-fileupload/tree/master/src/projects/core) [![npm](https://img.shields.io/npm/v/@ngx-file-upload/core.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/@ngx-file-upload/core)

### @Install

```bash
npm i --save @ngx-file-upload/ui @ngx-file-upload/core
```

### @Modules

#### NgxFileUploadUiModule

containing all UI modules, should imported if all resources should be used.

---

#### NgxFileUploadUiCommonModule

Includes following Pipes

- StateToStringPipe - converts UploadState to string value
- FileSizePipe - converts file size into human readable value
- IsCancelAblePipe - returns true if upload can canceled

app.module.ts

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiCommonModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadCoreModule
        NgxFileUploadUiCommonModule,
    ])],
    declarations: [...],
    entryComponents: [...],
    providers: [],
})
export class AppModule { }
```

app.component.html

```html
<ul>
    <!-- array of UploadRequests -->
    <li *ngFor="upload of uploads">
        <div>State: {{upload.file.state | stateToString }}</div>
        <div>Uploaded: {{upload.file.uploaded | fileSize }}</div>
        <div>Size: {{upload.file.size | fileSize }}</div>
        <button [disabled]="!(upload.file | isCancelAble)">Cancel</div>
    </li>
</ul>
```

Read Docs for more Informations: [Pipes](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/ui/pipes.md)

---

#### NgxFileUploadUiProgressbarModule

![ngx-file-upload/ui/progressbar-circle](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/bin/progressbar-circle.png)

Contains progress bars for visualization of the upload progress.

- CircleProgressbar

app.module.ts

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiProgressbarModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadCoreModule
        NgxFileUploadUiProgressbarModule,
    ])],
    declarations: [...],
    entryComponents: [...],
    providers: [],
})
export class AppModule { }
```

app.component.html

```html
<ul>
    <!-- array of UploadRequests -->
    <li *ngFor="upload of uploads" class="upload-item">
        <!-- circle progressbar -->
        <ngx-file-upload-ui--progressbar-circle
            [circleData]="{height: 70, width: 70, radius: 30}"
            [progress]="upload.file.progress"
        ></ngx-file-upload-ui--progressbar-circle>
    </li>
</ul>
```

app.component.scss

```css
:host {

    ...

    .upload-item::ng-deep {

        /** progressbars */
        svg circle {
            stroke: darken(#FFF, 50%);
            stroke-width: .5rem;

            &.progress {
                stroke: #FFF;
            }
        }

        /** percentage view */
        svg text {
            fill: #FFF;
            font-size: .7rem;
        }
    }
}
```

---

#### NgxFileUploadUiItemModule

![ngx-file-upload/ui/upload-item](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/bin/upload-item.png)

Contains customize able upload item

app.module.ts

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiItemModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadCoreModule
        NgxFileUploadUiItemModule,
    ])],
    declarations: [...],
    entryComponents: [...],
    providers: [],
})
export class AppModule { }
```

app.component.html

```html
<ul>
    <!-- array of UploadRequests -->
    <li *ngFor="upload of uploads" class="upload-item">
        <ngx-file-upload-ui--item [upload]="upload">
        </ngx-file-upload-ui--item>
    </li>
</ul>
```

Read Docs for more Informations: [Upload Item](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/ui/upload-item.md)

---

#### NgxFileUploadUiToolbarModule

![ngx-file-upload/ui/toolbar](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/bin/toolbar.png)

Contains UploadToolbar for visualisation of current upload progress and control to start, stop or clean up uploads.

app.module.ts

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiToolbarModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadCoreModule
        NgxFileUploadUiToolbarModule,
    ])],
    declarations: [...],
    entryComponents: [...],
    providers: [],
})
export class AppModule { }
```

app.component.html

```html
<ngx-file-upload-ui--toolbar [storage]="uploadStorage"></ngx-file-upload-ui--toolbar>
<ul>
    <!-- array of UploadRequests -->
    <li *ngFor="upload of uploads" class="upload-item">
        <!-- display upload data -->
    </li>
</ul>
```

---

#### NgxFileUploadUiFileBrowserModule

Simple directive for browse or drop files.

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiFileBrowserModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadCoreModule
        NgxFileUploadUiFileBrowserModule,
    ])],
    declarations: [...],
    entryComponents: [...],
    providers: [],
})
export class AppModule { }
```

app.component.html

```html
<div ngxFileUpload (add)="dropFiles($event)">
    <div class="file-browser">
        <span>Drop or Browse</span>
    </div>
</div>
```

Read Docs for more Informations: [Upload File Browser](https://github.com/r-hannuschka/ngx-fileupload/blob/master/docs/ui/upload-directive.md)

---

### @Demo

[Demo](https://r-hannuschka.github.io/ngx-fileupload/#/) can be found here.

### @Credits

Special thanks for code reviews, great improvements and ideas to

||||  
|:-:|:-:|:-:|
|[![alt Konrad Mattheis](https://avatars2.githubusercontent.com/u/1100969?s=60&v=4)](https://github.com/konne)<br />Konrad Mattheis| [<img src="https://avatars3.githubusercontent.com/u/17725886?s=60&v=4" width=60 alt="Thomas Haenig" />](https://github.com/thomashaenig)<br />Thomas Haenig| [![alt Alexander Görlich](https://avatars0.githubusercontent.com/u/13659581?s=60&v=4)](https://github.com/AlexanderGoerlich)  <br />Alexander Görlich|

### Author

Ralf Hannuschka [Github](https://github.com/r-hannuschka)
