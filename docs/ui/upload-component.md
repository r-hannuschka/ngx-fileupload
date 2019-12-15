# Upload Component

The Upload component is simply a default component to deliver a view and is not really required, you can allways use a complete diffrent view which implements fileupload core components [Upload Directive](./upload-directive.md) and [Upload Item](./upload-item.md).

## implement

```html
<ngx-fileupload [url]="'http://localhost:3000/upload'"></ngx-fileupload>
```

## @Input 

| name | type | description | mandatory |
|---|---|---|---|
| url | string | set url which should be used for http upload request | true |
| formDataName | string | form data field name which will contain file, not used if useFormData is set to false ( default file ) | false |
| template | TemplateRef<FileUploadItemContext> | the template which should used to show upload informations | false |
| useFormData | boolean | if set to false upload post request will add file into body (default true) instead of form data | false |
| validator | Validator/ValidatorFn | pre validators for all files which will added | false |
| storage | UploadStorage | UploadStorage which is used for all UploadRequests, if no one is passed it will create one | false |

## Further reading

- [Upload Directive](./upload-directive.md)
- [Upload Item](./upload-item.md)
- [Validation](./validation.md)