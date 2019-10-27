# Upload Storage

There are 2 ways to use a storage: 

1. with InjectionToken so you can inject this into any other view
2. only local


## Injection Token

You can use a InjectionToken if you want to inject your storage into other views, or you dont want to sit down on page and wait until all uploads are done. 
So you can allways come back and show your uploads again into view and dont have to cancel them or wait for a long time ...

1. Create new injection token

```ts
import { InjectionToken } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";

export const ExampleUploadStorage = new InjectionToken<UploadStorage>("Example Upload Storage", {
    providedIn: "root",
    factory: () => {
        return new UploadStorage();
    }
});
```

2. inject into your Component

```ts
import { Component, OnInit, Inject } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";
import { ExampleUploadStorage } from "./upload-storage.ts";

@Component({
    selector: "app-my-uploadcomponent",
    templateUrl: "my.component.html",
    styleUrls: ["./my.component.scss"]
})
export class MyComponent implements OnInit {

    constructor(
        @Inject(ExampleUploadStorage) public storage: UploadStorage
    ) { }

    ...
}
```

3. pass to default view

```html
<ngx-fileupload [url]="'http://upload.to/dev/null'" [storage]="storage"></ngx-fileupload>
```

## Local

1.

```ts
import { Component, OnInit, Inject } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-my-uploadcomponent",
    templateUrl: "my.component.html",
    styleUrls: ["./my.component.scss"]
})
export class MyComponent implements OnInit {

    public storage: UploadStorage;

    constructor() {
        /** configure storage to handle 3 uploads instad 5 at once */
        this.storage = new UploadStorage({
            concurrentUploads: 3
        })
    }

    public ngOnDestroy() {
        /**
         * We have to destroy the storage since we could not get him back.
         * This will cancel and remove all active uploads.
         */
        this.storage.destroy();
    }
}
```

2. pass to default view

```html
<!--
    by default you dont have to pass any storage to ngx-fileupload, if no storage
    has been passed it will create his own and destroy the storage on destroy.
-->
<ngx-fileupload [url]="'http://upload.to/dev/null'" [storage]="storage"></ngx-fileupload>
```

## API

### Properties

| name |description |
|---|---|
|change: Observable<UploadRequest[]> |Observable to get notified if something in store changed (added, removed) |
|queueChange: Observable<QueueState> | Observable to get notified if queue changed upload processing, upload pending|

### Methods

| name | params | description |
|---|---|---|
|add | request: UploadRequest| adds new UploadRequest to storage |
|remove | request:string | remove upload request from storage by given **UploadRequest.requestId** |
|remove | request:UploadRequest | remove upload from storage by given **UploadRequest** |
|purge  |  | remove all uploads which has canceled, invalid or upload completed with success, uploads which requests completes with an error will not removed since we could retry them |
|startAll || starts all idle uploads |
|stopAll || stops all uploads and remove them from storage |
|removeInvalid || remove all invalid uploads from storage|
|destroy|| destroys storage|

### Interface QueueState

```ts
export interface QueueState {
    /**
     * all uploads which has state pending
     */
    pending: UploadRequest[];

    /**
     * all uploads which has beens started and currently running
     */
    processing: UploadRequest[];
}
```

### UploadStorage Configuration

Configuration which could passed to UploadStorage constructor, if no one is passed it will take default configuration with concurrentUploads 5

```ts
export interface UploadStorageConfig {
    /** how many upload requests could handled at once in queue */
    concurrentUploads?: number;
}
```