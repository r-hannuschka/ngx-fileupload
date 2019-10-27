# Changelog

## 3.0.1

### bugfixes

- fixed bug cancel / destroy idle uploads could start next upload in queue

## 3.0.0

### features

- implement upload storages which holds all upload requests
- implement upload queue, that means that by default only 5 uploads can run concurrently all others will pending until we have more space
- add new icons and customize view 
- add new upload state: PENDING
- rename upload state QUEUED to IDLE
- all upload states are now numeric instead of strings, before UploadState.INVALID = 'invalid' after UploadState.INVALID = 1
- add new pipe stateToString to convert UploadState to string value
- Library exported now UploadApi, use in template with public uploadStates = UploadApi.UploadState, in template uploadStates.IDLE

## 2.1.1

### bugfixes

- fixed bug peer dependency angular-pipes still exists
- fixed bug tsconfig paths not working in lib package
- fixed bug response 404 show html source from 404 page

# Changelog

## 2.1.0

### features

- add demo page for more examples (customize / validators)
- remove angular pipes dependecy and replace with internal fileSize pipe to show file size formatted
- add output completed to ngx-fileupload-item to get notified upload for file has been completed
- response errors now allways sanitized to be an array, remove toArray pipe

### bugfixes

- fixed bug all uploads stay alive even component gets destroyed
- fixed bug could not add any files anymore after there are files in list
- fixed style issues

## 2.0.1

- update dependencies

## 2.0.0

- reworking validation

# Changelog

## 1.0.4

### dependencies

- update angular to 8.1.2
- update angularcli to 8.1.2

## 1.0.3

### dependencies

- angular 8.1.1
- angularcli 8.1.1
- karma 4.2.0
- karma-chrome-launcher 3.0.0
- compdoc 1.1.10

## 1.0.2

### bugfixes

- fixed bug uploads could not started via upload control
- fixed bug animation not working if only one upload exists
- fixed bug cancel action not stop event propagation

### other changes

- code clean up
- improve e2e tests
- add docs

### dependencies

- update letslog to 1.0.12

## 1.0.1

### bugfixes

- fixed bug same file could not uploaded twice with click [#30](https://github.com/r-hannuschka/ngx-fileupload/issues/30)

## 1.0.0

### breaking changes

- change class name UploadComponent to NgxFileUploadComponent
- change file name components/upload.component.ts to components/ngx-fileupload.component.ts
- change class name UploadItemComponent to NgxFileUploadItemComponent
- change file name components/upload-item.component to components/ngx-fileupload-item.component.ts
- change UploadContext to FileUploadItemContext (ngx-fileupload-item template context)
- FileUpload.hasError only return true anymore if upload is invalid, FileUpload.isInvalid() should be used now

### features

- add css class item-action--(upload, retry, stop) to item action buttons
- add e2e tests
- add option useFormData (boolean) if false it will send file as body (default true)
- add option formDataName (string) if formData is enabled this is the name which will be used for file (default file)

### other changes

- add more unit tests
- add e2e tests
- fix tslint errors
- generate docs

### ci

- code coverate
- e2e tests

## 0.4.0

### breaking changes

- change spelling NgxFileupload... to NgxFileUpload...
- NgxFileUploadDirective is now exported as ngxFileUploadRef (before ngxFileuploadRef)

### features

- add support on ngx-fileupload directive to open file select window, triggered on click
- add clean all action on ngx-fileupload directive to remove only broken downloads
- add more styling

### fixes

- stop all click events from items, to ensure we dont affect any other parent component
- update readme files

### other

- update packages to angular 8.1

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
