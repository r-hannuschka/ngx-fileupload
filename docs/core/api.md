
# API 

## FileUploadItemContext 

```
export interface FileUploadItemContext {
    data: FileUpload;
    ctrl: UploadControl;
}
```

---

## FileUpload

```
export interface FileUpload {

    readonly raw: File;

    readonly size: number;

    readonly name: string;

    readonly type: string;

    response: UploadResponse;

    state: UploadState;

    uploaded: number;

    validationErrors: ValidationErrors | null;

    progress: number;

    hasError: boolean;
}
```

---

## UploadControl

```
interface UploadControl {

    retry(): void;

    start(): void;

    stop(): void;

    remove(): void;
}
```

---

## Upload Response

```
interface UploadResponse {
    success: boolean;
    errors: any;
    body: any;
}
```

---

## UploadState

```
enum UploadState {
    INVALID   = 0,
    CANCELED  = 1,
    IDLE      = 2,
    PENDING   = 3,
    START     = 4,
    PROGRESS  = 5,
    COMPLETED = 6
}
```

---

## UploadRequest

```
interface UploadRequest {

    requestId: string;

    readonly change: Observable<FileUpload>;

    readonly file: FileUpload;

    readonly destroyed: Observable<boolean>;

    beforeStart(hook: Observable<boolean>): void;

    destroy(): void;

    cancel(): void;

    hasError(): boolean;

    isIdle(): boolean;

    isInvalid(): boolean;

    isProgress(): boolean;

    isPending(): boolean;

    isCompleted(ignoreError?: boolean): boolean;

    isCanceled(): boolean;

    retry(): void;

    start(): void;
}
```

---

## Upload Options

```ts
export interface UploadOptions {

    url: string;

    formData?: {
        /**
         * if false file will passed directly as body
         */
        enabled: boolean;
        /**
         * namespace where to find
         */
        name?: string;
        /**
         * additional meta information for file upload as JSON
         */
        metadata?: Record<string, unknown>;
    };
}
```

---

## UploadStorage Configuration

```ts
interface UploadStorageConfig {

    concurrentUploads?: number;

    autoUpload?: boolean;

    removeCompleted?: number;
}
```

---

## NgxFileUploadFactory

```ts
interface NgxFileUploadFactory {

    createUploadRequest<T extends File | File[]>(
        file: T, options: UploadOptions, validator?: Validator | ValidationFn
    ): T extends File[] ? UploadRequest[] : UploadRequest;
}
```

--- 

## ValidationErrors

```
interface ValidationErrors {
    [key: string]: any;
}
```

---

## Validator

```
export interface Validator {
    validate(file: File): ValidationErrors | null;
}
```
