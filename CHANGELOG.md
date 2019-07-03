# Changelog

## 0.4.0-beta.2

### breaking changes

- change spelling NgxFileupload... to NgxFileUpload...
- NgxFileUploadDirective is now exported as ngxFileUploadRef (before ngxFileuploadRef)

### fixes

- stop all click events from items, to ensure we dont affect any other parent component

## 0.4.0-beta.1

### fixes

- update changelog

## 0.4.0-beta.0

### features

- add support on ngx-fileupload directive to open file select window, triggered on click
- add clean all action on ngx-fileupload directive to remove only broken downloads

## 0.3.0

### breaking changes

- remove *UploadTemplateContext.data.error*, if an error occurs  
    it is written now to *UploadTemplateContext.data.message*

### features

- validation providers could now defined
- write upload response data to upload model
  
### other changes

- show notifications for error / invalid / completed
- update scss / upload-item template

## 0.2.1

### bugfixes

- fixed docs

## 0.2.0

### breaking changes

- ngxFileUploadDirective, upload renamed to uploadAll, cancel renamed to cancelAll

### features

- on error, upload will not completed anymore instead a retry button will shown
- add UploadControl.retry(), if upload failed it could be uploaded

```html
<!-- insert own retry button in custom template -->
<ng-template let-uploadData="data" let-uploadCtrl="ctrl">
    <button *ngIf="data.hasError" (click)="uploadCtrl.retry()">retry</button>
</ng-template>
```

- update item template, add new button upload (@see uploadCtrl.start())
- css changes
- add more documentaion

### bugfixes

- ngxFileuploadDirective cancel(All) not working correctly
