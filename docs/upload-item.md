
# FileUploadItem Component

This Component represents a single upload (view) and gives some control over that upload. It is recommended this will used together
with [Upload Directive](./upload-directive.md).

## Implement

```ts
...
import { NgxFileUploadFactory, UploadOptions, UploadRequest, UploadStorage } from "@r-hannuschka/ngx-fileupload";
...

@Compononent({
    template: `
        <div ngxFileUpload (add)="dropFiles($event)"> ... </div>

        <div class="fileupload list>
            <ngx-fileupload-item *ngFor="upload of uploads" [upload]="upload">
            </ngx-fileupload-item>
        </div>
    `,
    selector: 'app-upload-component'
})
class UploadComponent implements OnInit {

    public uploads: UploadRequest[];

    private storage: UploadStorage;

    private destroyed$: Subject<boolean> = new Subject();

    public constructor(
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.storage = new UploadStorage({
            concurrentUploads: 2,
            enableAutoUpload: true
        });
    }

    public ngOnInit() {
        this.storage.change
            .pipe(takeUntil(this.destroyed$))
            .subscribe((requests: UploadRequest[]) => this.uploads = requests);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();

        this.storage.destroy();
    }

    /**
     * files get dropped
     */
    public dropFiles(files: File[]) {
        const options: UploadOptions = {url: "http://dev/null" };
        const uploads = this.uploadFactory.createUploadRequest(files, options);
        this.uploadStorage.add(uploads);
    }
}
```

## @Input

| name | type | description | mandatory |
|---|---|---|---|
| template | TemplateRef&lt;FileUploadItemContext&gt; | the template which should used to show upload informations | false |
| upload | [FileUpload](../src/lib/ngx-fileupload/services/file-upload.ts#37) | the UploadRequest which sould visualized | true |

## Custom Template

There is allready a default template defined which will be used if no custom template is given, 
if you want any other view you could just pass your own template to component __@Input[template]__ which should used to show upload informations.

@example 

```html
<ng-template #customItemTemplate>
    <!-- upload informations comes here -->
</ng-template>

<div class="fileupload list">
    <ngx-fileupload-item *ngFor="upload of uploads" [upload]="upload" [template]="customItemTemplate">
    </ngx-fileupload-item>
</div>
```

to fill our template with life there is a context to the template injected, contains a remote control and upload informations.

@example

```html
<ng-template #customItemTemplate let-upload="data" let-control="ctrl">
    <!-- show name and uploaded bytes -->
    <span>{{data.name}}</span>
    <span>{{data.uploaded}}></span>

    <!-- add single action to upload a file -->
    <button (click)="ctrl.start()"></button>
    <button (click)="ctrl.stop()"></button>
</ng-template>

<div class="fileupload list">
    <ngx-fileupload-item *ngFor="upload of uploads" [upload]="upload" [template]="customItemTemplate">
    </ngx-fileupload-item>
</div>
```

> This is a very simple view, to see all a full template take a look on [Default Upload Item Template](../src/lib/ngx-fileupload/components/ngx-fileupload-item.component.html)


## Template Context

Since the component could load a custom template we have to provide some data / control to the upload, to get this we inject a template context containing all informations / methods you will need to show upload informations and control (upload, cancel, retry).

- data

    | name | type | description |
    |---|---|---|
    | hasError | boolean | true if upload was completed but with an error response.errors is not empty |
    | name | string | name of file |
    | progress | number | progress in percent |
    | response   | [UploadResponse](../src/lib/ngx-fileupload/model/upload.ts#13) | Holds response from server after upload has been completed (success / error) |
    | size | number | size of file |
    | state | string | current state of upload, one of [canceled, queued, progress, error,  uploaded, invalid] |
    | type | string | mime type of file which should uploaded |
    | uploaded | number | uploaded size in byte |
    | validationErrors | {[validatorName: string]: string} or NULL | Object with key value if file is invalid or NULL |

- @example data with validation error

    ```
    {
        "hasError": false,
        "name": "demo_fileupload (1).mp4",
        "progress": 0,
        "response": {
            "body": null,
            "errors": null,
            "success": null
        },
        "size": 1864736,
        "state": 0,
        "type": "video/mp4",
        "uploaded": 0,
        "validationErrors": {
            "isImage": "not a valid image file"
        }
    }
    ```

- ctrl

    | action | description |
    |---|---|
    | retry | if an uploads failed you could retry upload the file, unless it is simply invalid |
    | start | starts request to upload a file to server |
    | stop | cancel upload, this will set state of upload to canceled |
    | remove | destroys an upload and removes the upload from store |

### Interface UploadControl

## Further reading

- [API](./api.md)
- [Upload Directive](./upload-directive.md)
