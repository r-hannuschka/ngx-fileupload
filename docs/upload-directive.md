# Upload Directive

Simple file drop zone and file browser, listen to add event to get files which was selected for upload.

@example

```ts
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { UploadRequest, UploadStorage, UploadOptions } from "../../upload";
import { NgxFileUploadFactory } from "../../utils";

@Compononent({
    template: `
        <-- bind file browser directive to any element -->
        <div class="fileupload" ngxFileUpload (add)="onFilesDrop($event)">
            drag drop files here or click
        </div>

        <div class="fileupload list>
            <ngx-fileupload-item *ngFor="let upload of uploads" [upload]="upload"></ngx-fileupload-item>
        </div>
    `,
    selector: 'app-upload-component'
})
class UploadComponent implements OnInit {

    public uploads: UploadRequest[];

    public storage: UploadStorage;

    private destroyed: Subject<boolean> = new Subject();

    public constructor(
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.storage = new UploadStorage();
    }

    public ngOnInit() {
        this.storage.change
            .pipe(takeUntil(this.destroyed))
            .subscribe((uploads: UploadRequest[]) => this.uploads = uploads);
    }

    public ngOnDestroy() {
        /** @todo implement */
    }

    /**
     * handle add event from file browser directive
     * 
     * create new request with upload factory and attach,
     * them to upload storage
     */
    public onFilesDrop(files: File[]) {

        /** configure upload options */
        const uploadOptions: UploadOptions = {
            url: 'http://localhost:3000/upload/gallery',
            formData: {
                enabled: true,
                name: 'picture'
            }
        }

        const uploads = this.uploadFactory.createUploadRequest(files, uploadOptions /*, validators */);
        this.uploadStorage.add(uploads);
    }
}
```

## @Input

| name | type | description | mandatory |
|---|---|---|---|
| ngxFileUpload | void | adds file browser to any element | true |

## @Output

| name | type | description |
|---|---|---|---|
| add | File[] | files which was added for upload |

## Further reading

- [Upload Factory](./factory.md)
- [Upload Storage](./upload.storgage.md)