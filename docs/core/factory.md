
# NgxFileUploadFactory

Factory to create new UploadRequests

## Usage

```ts
...
import {
    UploadStorage,
    NgxFileUploadFactory,
    UploadOptions,
    UploadRequest
} from "@r-hannuschka/ngx-fileupload";
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

        const uploadRequest: UploadRequest = 
            this.uploadFactory.createUploadRequest(droppedFile, this.uploadOptions);

        this.uploadStorage.add(requests);
    }

    /**
     * create multiple UploadRequests, just pass File[] to createUploadRequest
     */
    public multipleFiles(files: File[]) {

        const uploadRequest: UploadRequest[] = 
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
|createUploadRequest | File, UploadOptions [, ValidatorFn \| Validator] | UploadRequest | creates new UploadRequest which could added to storage |
|createUploadRequest | File[], UploadOptions [, ValidatorFn \| Validator]  | UploadRequest[] | creates multiple UploadRequests which could added to storage |

### Interface UploadOptions

```ts
export interface UploadOptions {

    /**
     * url which should used to upload file
     */
    url: string;

    /**
     * form data options
     */
    formData?: {

        /**
         * if set to false, file will send through post body and not wrapped in
         * FormData Object
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
