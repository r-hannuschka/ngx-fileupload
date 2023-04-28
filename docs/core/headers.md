# Add headers

You can attach as many headers you want this is very much straight forward, for example adding X-RefKey Header to upload Request

## Interface Headers

```ts
export interface NgxFileUploadHeaders {
    [key: string]: string | AuthorizationHeader;
    authorization?: string | AuthorizationHeader;
}
```

### example

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
        headers: {
            "X-RefKey": "0123456789abcedf"
        }
    };

    ...

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

## Add Authorization Header

to provide send an authorization header we added **authorization** to headers

### Interface Authorization Header

```ts
interface AuthorizationHeader {
    key?: string;
    token: string;
}
```

### example

there are 3 ways to pass an authorization header

- passing a string value

    ```ts
    /** upload options */
    const uploadOptions: UploadOptions = {
        url: "http://localhost:3000/upload/gallery",
        headers: {
            /**
             * will send header:
             *
             * Authorization: Bearer my-token
             */
            authorization: "my-token",
        }
    };
    ```

- passing an object

    ```ts
    /** upload options */
    const uploadOptions: UploadOptions = {
        url: "http://localhost:3000/upload/gallery",
        headers: {
            /**
             * pass an object, if no key is passed it will take Bearer by default
             * so this is the same as authorization: "my-token"
             *
             * Authorization: Bearer my-token
             */
            authorization: {token: "my-token" },
        }
    };
    ```

- passing an custom authorization header

    ```ts
    /** upload options */
    const uploadOptions: UploadOptions = {
        url: "http://localhost:3000/upload/gallery",
        headers: {
            /**
             * if you set an key this will be used as token name
             * sends header:
             *
             * Authorization: MyAuthToken my-token
             */
            authorization: {key: "MyAuthToken", token: "my-token" },
        }
    };
    ```


## Send HTTP-only cookies

Set `withCredentials` in the upload options when creating a request.

### example

```ts
/** upload options */
const uploadOptions: UploadOptions = {
    url: "http://localhost:3000/upload/gallery",
    withCredentials: true
};
```
