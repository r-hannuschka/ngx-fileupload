# NgxFileUploadProgressbarModule

Contains progress bars for visualization of the upload progress.

### Circle Progressbar

![ngx-file-upload/ui/progressbar-circle](https://raw.githubusercontent.com/r-hannuschka/ngx-fileupload/master/docs/bin/progressbar-circle.png)

Circle Progressbar which can be split into parts with gap or display completly as one. Can be animated by css.

app.module.ts

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";
import { NgxFileUploadUiProgressbarModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadCoreModule,
        NgxFileUploadUiProgressbarModule,
    ])],
    declarations: [app.component.ts]
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
            class="progressbar"
            [progress]="upload.data.progress">
        </ngx-file-upload-ui--progressbar-circle>
    </li>
</ul>
```

app.component.scss

```css
:host {

    .upload-item .progressbar::ng-deep {
        height: 100px;
        width: 100px;

        circle {
            stroke: lighten(#0D1F2D, 10%);
            stroke-width: .9rem;

            &.progress {
                stroke-width: .9rem;
                stroke: #0582CA;
            }
        }

        /** text label */
        span {
            color: #0D1F2D;
        }
    }
}
```

#### @Input

| name | type | description | default |
|---|---|---|---|
| progress | number | progress in % | 0 |
| parts | number | number of parts to shown | 1 |
| gap | number | space between parts | 1 |
| radius | number | radius of circle | default svg(width\|height) / 2 |

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
app.component.scss

```scss
:host {

    .upload-item::ng-deep {

        .progressbar.back {
            stroke: darken(#006494, 10);
        }

        .progressbar.progress {
            stroke: #0582CA;
        }
    }
}
```

#### @Input

| name | type | description | default |
|---|---|---|---|
| progress | number | progress in % | 0 |
| parts | number | number of parts to shown [part]="5" eq 20% | 1 |
| gap | number | space between parts | 1 |
| animate | boolean | disable / enable animation | true |
| duration | number | duration time of animation in milliseconds | 250 |
