
# NgxFileUploadFactory

Factory to create new UploadRequests

## Usage

```ts
...
import {
    NgxFileUploadStorage,
    NgxFileUploadFactory,
    NgxFileUploadOptions,
    NgxFileUploadRequest
} from "@ngx-file-upload/core"
...

@Component({
    selector: "app-my-component",
    templateUrl: "my-component.html",
    styleUrls: ["./my-component.scss"]
})
export class MyComponent implements OnDestroy, OnInit {

    ...

    /** upload options */
    private uploadOptions: UploadOptions = {
        url: "http://localhost:3000/upload/gallery",
        formData: {
            enabled: true,
            name: "picture"
        }
    };

    constructor(
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.uploadStorage = new UploadStorage({
            concurrentUploads: 2
        });
    }

    /**
     * create single UploadRequest, just pass File to createUploadRequest
     */
    public fileSelectOrDrop(file: File) {

        const uploadRequest: NgxFileUploadRequest = 
            this.uploadFactory.createUploadRequest(droppedFile, this.uploadOptions);

        this.uploadStorage.add(requests);
    }

    /**
     * create multiple UploadRequests, just pass File[] to createUploadRequest
     */
    public multipleFiles(files: File[]) {

        const uploadRequest: NgxFileUploadRequest[] = 
            this.uploadFactory.createUploadRequest(files, this.uploadOptions);

        this.uploadStorage.add(requests);
    }

    ...
}
```

## API

### Methods

| name | params | create | description |
|---|---|---|---|
|createUploadRequest | File, NgxFileUploadOptions [, ValidatorFn \| Validator] | NgxFileUploadRequest | creates new UploadRequest which could added to storage |
|createUploadRequest | File[], NgxFileUploadOptions [, ValidatorFn \| Validator]  | NgxFileUploadRequest[] | creates multiple UploadRequests which could added to storage |

### Interface NgxFileUploadOptions

```ts
export interface UploadOptions {
    /**
     * url which should used to upload file this is mandatory
     */
    url: string;
    /**
     * form data options
     */
    formData?: {
        /**
         * if set to false, file will send through post body and not wrapped in
         * FormData Object default true
         */
        enabled: boolean;
        /**
         * only used if FormData is enabled, defines the name which should used
         * in FormData
         * 
         * @example
         * 
         * // on server
         * req.files.picture;
         */
        name?: string;
    };
    /**
     * add aditional headers to request
     */
    headers?: NgxFileUploadHeaders;
}
```


### Interface NgxFileUploadFactory

```ts
export interface NgxFileUploadFactory {
    createUploadRequest<T extends File | File[]>(
        file: T, options: UploadOptions, validator?: Validator | ValidationFn
    ): T extends File[] ? UploadRequest[] : UploadRequest;
}
```
