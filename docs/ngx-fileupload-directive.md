# Ngx Fileupload Directive

This directive has 4 main tasks:

1. register events ( click open file browser ), drag events if some files will moved via drag drop into the upload zone
2. factory to create a new upload(s) from a file
3. pre validate if validators has been added
4. works as controller to cancel / upload / clean over __all__ uploads which has been added

Since the ngxFileUpload Directive provides no own view, you have to add this to any component which should be used as drop zone
and listen to the __add__ event.

@example

```ts
@Compononent({
    template: `
        <div class="fileupload" [ngxFileUpload]="url" (add)="onUploadAdd($event)">
            drag drop files here or click
        </div>
        <div class="fileupload list>
            <!-- @todo show uploads here -->
        </div>
    `,
    selector: 'app-upload-component'
})
class UploadComponent {

    public url: string = "localhost/upload";

    public uploads: NgxFileUpload[];

    /**
     * @param uploads:NgxFileUpload which has been created from selected / dropped files
     */
    public onUploadAdd(uploads: NgxFileUpload[]) {
        /** @todo something with the uploads which has been added */
    }
}
```

> To display uploads see [Upload Item](./upload-item.md) for more informations.

## Control Uploads

As already mentioned this directive works also as controller for __all__ uploads which has been added, to make use of this the directive iteself is exported as __ngxFileUploadRef__ so this could be used directly into the template like this.

```ts
@Compononent({
    template: `
        <div class="fileupload" [ngxFileUpload]="url" (add)="onUploadAdd($event)" #ngxFileUploadRef='ngxFileUploadRef'>
        </div>
        <div class="fileupload list>
            <!-- @todo show uploads here -->
        </div>
        <div class="upload actions">
            <button (click)="ngxFileUploadRef.uploadAll()">Upload</button>
            <button (click)="ngxFileUploadRef.cleanAll()">Clean up</button>
            <button (click)="ngxFileUploadRef.cancelAll()">Cancel all</button>
        </div>
    `,
    selector: 'app-upload-component'
})
class UploadComponent {
    ...
}
```

| action | description |
|---|---|
| uploadAll | start upload for all files in list which are not invalid or got an error |
| cleanAll | remove all uploads from list which are invalid or got an error |
| cancelAll | cancel all uploads (even if they running allready) and remove them from list |

## Input parameters

| @Input | type | description | mandatory |
|---|---|---|---|
| url / [ngxFileUpload] | string | set url which should be used for http upload request | true |
| useFormData | boolean | if set to false upload post request body will use file in body (default true) | false |
| formDataName | string | form data field name which will contain file, not used if useFormData is set to false ( default file ) | false |
| validator | Validator/ValidatorFn | pre validators for all files which will added | false |

## Further reading

- [Validation](./validation.md)
- [Upload Item](./upload-item.md)