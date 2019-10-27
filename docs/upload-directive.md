# Upload Directive

This directive has 4 main tasks:

1. register events ( click open file browser ), drag events if some files will moved via drag drop into the upload zone
2. pre validate if validators has been added

Since the ngxFileUpload directive provides no own view, you have to add this to any component which should be used as drop zone
and listen to the __add__ event.

@example

```ts
@Compononent({
    template: `
        <div class="fileupload" [ngxFileUpload]="url" [storage]="storage">
            drag drop files here or click
        </div>
        <div class="fileupload list>
            <ngx-fileupload-item *ngFor="let upload of uploads" [upload]="upload"></ngx-fileupload-item>
        </div>
    `,
    selector: 'app-upload-component'
})
class UploadComponent implements OnInit {

    public url: string = "http://localhost/upload";

    public uploads: UploadRequest[];

    public storage: UploadStorage;

    private destroyed: Subject<boolean> = new Subject();

    public constructor() {
        /** create local storage */
        this.storage = new UploadStorage();
    }

    public ngOnInit() {
        this.storage.change
            .pipe(takeUntil(this.destroyed))
            .subscribe((uploads: UploadRequest[]) => this.uploads = uploads);
    }

    public ngOnDestroy() {
        this.storage.destroy();

        this.destroyed.next(true);
        this.destroyed.complete();

        this.storage   = null;
        this.destroyed = null;
    }
}
```

## @Input

| name | type | description | mandatory |
|---|---|---|---|
| url / [ngxFileUpload] | string | set url which should be used for http upload request | true |
| storage | UploadStorage | UploadStorage to add new UploadRequests | true |
| useFormData | boolean | if set to false upload post request will add file into body (default true) instead of form data | false |
| formDataName | string | form data field name which will contain file, not used if useFormData is set to false ( default file ) | false |
| validator | Validator/ValidatorFn | pre validators for all files which will added | false |

## Further reading

- [Validation](./validation.md)
- [Upload Item](./upload-item.md)