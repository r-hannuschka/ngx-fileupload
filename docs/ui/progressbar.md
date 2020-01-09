# NgxFileUploadProgressbarModule

Contains progress bars for visualization of the upload progress.

### Circle Progressbar

![ngx-file-upload/ui/progressbar-circle](https://raw.githubusercontent.com/r-hannuschka/ngx-fileupload/master/docs/bin/progressbar-circle.png)


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
            [progress]="upload.data.progress"
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

### Progressbar

![ngx-file-upload/ui/progressbar](https://raw.githubusercontent.com/r-hannuschka/ngx-fileupload/master/docs/bin/progressbar.png)

Simple Progressbar which can be split into parts with gap or display completly as one.

AppModule

```ts
import { NgModule } from "@angular/core";
import { NgxFileUploadUiProgressbarModule } from '@ngx-file-upload/ui';
import { AppComponent } from "./components";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadUiProgressbarModule,
    ])],
    declarations: [AppComponent],
    providers: [],
})
export class AppModule { }
```

app.component.html

```html
<ul>
    <li *ngFor="upload of uploads" class="upload-item">

        <!-- full progressbar without parts / gap -->
        <ngx-file-upload-ui--progressbar [progress]="upload.data.progress">
        </ngx-file-upload-ui--progressbar>

        <!-- 5 parts (eq 20%) with gap of 1 px by default -->
        <ngx-file-upload-ui--progressbar [progress]="upload.data.progress" [parts]="5">
        </ngx-file-upload-ui--progressbar>

        <!-- 20 parts (eq 5%) with gap of 4 px -->
        <ngx-file-upload-ui--progressbar [progress]="upload.data.progress" [parts]="20" [gap]="4">
        </ngx-file-upload-ui--progressbar>
    </li>
</ul>
```

#### @Input

| name | type | description | default |
|---|---|---|---|
| parts | number | number of parts to shown [part]="5" eq 20% | 1 |
| gap | number | space between parts | 1 |
| animate | boolean | disable / enable animation | true |
| duration | number | duration time of animation in milliseconds | 250 |
