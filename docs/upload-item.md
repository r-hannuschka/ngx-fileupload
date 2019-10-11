
# FileUploadItem Component

This Component represents a single upload (view) and gives some control over that upload. It is recommended this will used together
with [Upload Directive](./upload-directive.md).

## Implement

```ts
@Compononent({
    template: `
        <div [ngxFileUpload]="url" (add)="onUploadAdd($event)"> ... </div>

        <div class="fileupload list>
            <ngx-fileupload-item *ngFor="upload of uploads" [upload]="upload">
            </ngx-fileupload-item>
        </div>
    `,
    selector: 'app-upload-component'
})
class UploadComponent {

    public url = "...";

    public uploads: NgxFileUpload[];

    /**
     * @param uploads:NgxFileUpload which has been created from selected / dropped files
     */
    public onUploadAdd(uploads: NgxFileUpload[]) {
        this.uploads = this.uploads.concat(uploads);
    }
}
```

## @Input

| name | type | description | mandatory |
|---|---|---|---|
| template | TemplateRef<FileUploadItemContext> | the template which should used to show upload informations | false |
| upload | [FileUpload](../src/lib/ngx-fileupload/services/file-upload.ts#37) | the upload which has been created from upload directive | true |

## @Output

| name | type | description |
|---|---|---|
| changed | EventEmitter:UploadModel | @deprecated emits if upload state has been changed |
| completed | EventEmitter:FileUpload | emits if upload has been completed, this not includes file upload contains errors (ServerResponse Error) or invalidated |
| stateChange | EventEmitter:FileUpload | emits if upload state has been changed |

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

>There are 2 other important reasons when to define a custom item template.
>
>__Validation__:
>
>as allready mentionned we use an interface which is very much the same as [ValidationErrors](https://angular.io/api/forms/ValidationErrors), but the problem is you can write everything you want since this is defined as any and has no fixed type. To handle this we following only this format:
>```json
>{
>    [key:string]: string
>}
>```
>
>__Response__
>
>this is the same for response we just implement a custom interface for a [UploadResponse](../src/lib/ngx-fileupload/model/upload.ts#13), to have errors and response body
into one object and.
> 
> Response.errors could be any since we dont know what your server will return if something failed, so we support for errors: string|string[] to show this up correctly
>
> @example error response from server:
> ```ts
> /** i know it is nodejs */
> res.status(401).send("not authorized to upload any files");
> // or 
> res.status(400).send(["invalid file size", "invalid file type"]);
> ```
>
> Response.body very much the same (it has to be a JSON but content), this is not that critical since angular response.body allways exists, so we just copy all data from
> response.body to our response and looking for a property messsage, if this not exists it will fallback to a default success message "name of file, uploaded"
> 
> @example
> 
> ```ts
> res.status(200).send({
>    message: 'File was uploaded',
>    data: ...
> })
> ```
> 
> If you expect diffrent Validation Errors or Server Responses (Error / Success) u have to implement your own item template to show informations.


## Template Context

Since the component could load a custom template we have to provide some data / control to the upload, to get this we inject a template context containing all informations / methods you will need to show upload informations and control (upload, cancel, retry).

- data

    | name | type | description |
    |---|---|---|
    | name | string | name of file |
    | progress | number | progress in percent |
    | response   | [UploadResponse](../src/lib/ngx-fileupload/model/upload.ts#13) | Holds response from server after upload has been completed (success / error) |
    | size | number | size of file |
    | state | string | current state of upload, one of [canceled, queued, progress, error,  uploaded, invalid] |
    | uploaded | number | uploaded size in byte |
    | validation | [UploadValidation](../src/lib/ngx-fileupload/model/upload.ts#19) | show validation errors for upload if validator if added |

- ctrl

    | action | description |
    |---|---|
    | retry | if an uploads failed you could retry upload the file, unless it is simply invalid |
    | start | starts request to upload a file to server |
    | stop | cancel upload, this will set state of upload to canceled and trigger completed event |

## Further reading

- [Upload Directive](./upload-directive.md)