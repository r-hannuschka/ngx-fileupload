import { Observable } from "rxjs";
import { ValidationErrors } from "./validation";

export interface UploadResponse {
    success: boolean;
    errors: any;
    body: any;
}

export enum UploadState {
    INVALID   = 0,
    CANCELED  = 1,
    IDLE      = 2,
    PENDING   = 3,
    START     = 4,
    PROGRESS  = 5,
    COMPLETED = 6
}

export interface UploadControl {

    retry(): void;

    start(): void;

    stop(): void;

    remove(): void;
}

export interface UploadValidation {
    errors: ValidationErrors | null;
}

export interface UploadRequestData {

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

export interface UploadRequest {

    requestId: string;

    /**
     * returns observable which notify if file upload state
     * has been changed
     */
    readonly change: Observable<UploadRequestData>;

    readonly data: UploadRequestData;

    readonly destroyed: Observable<boolean>;

    beforeStart(hook: Observable<boolean>): void;

    destroy(): void;

    /**
     * cancel current file upload, this will complete change subject
     */
    cancel(): void;

    /**
     * return true if upload was not completed since the server
     * sends back an error response
     */
    hasError(): boolean;

    isIdle(): boolean;

    /**
     * returns true if validators are set and upload not validated
     */
    isInvalid(): boolean;

    isProgress(): boolean;

    isPending(): boolean;

    isCompleted(ignoreError?: boolean): boolean;

    isCanceled(): boolean;

    retry(): void;

    start(): void;
}

export interface UploadStorageConfig {
    /**
     * max count of uploads at once, set to -1 for no limit
     */
    concurrentUploads: number;
    /**
     * if set to true it will automatically starts uploads
     */
    autoStart?: boolean;
    /**
     * if set it will remove success full completed uploads after a specific
     * amount of time.
     */
    removeCompleted?: number;
}

/**
 * Upload Options
 */
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
         */
        name?: string;
    };
}
