
# NgxFileUploadFactory

Factory to create new UploadRequests


## Usage

```ts
...
import { UploadStorage, NgxFileUploadFactory, UploadOptions, UploadRequest } from "@r-hannuschka/ngx-fileupload";
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
            /**
             * enable formdata, if false file will send directly in body
             */
            enabled: true,
            /**
             * FormData field name:
             * uploaded file could be found in req.files.picture;
             */
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
     * files get dropped
     */
    public fileSelectOrDrop(file: File) {
        const uploadRequest: UploadRequest = this.uploadFactory.createUploadRequest(droppedFile, this.uploadOptions);
        this.uploadStorage.add(requests);
    }

    ...
}

```

## API

### Methods

| name | params | description |
|---|---|---|
|createUploadRequest | request: UploadRequest, options: UploadOptions, validator?: ValidationFn| adds new UploadRequest to storage |
|createUploadRequest | request: UploadRequest, options: UploadOptions, validator?: Validator| adds new UploadRequest to storage |

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
    createUploadRequest: (
        file: File,
        options: UploadOptions,
        validators?: Validator | ValidationFn
    ) => UploadRequest;
}
```
