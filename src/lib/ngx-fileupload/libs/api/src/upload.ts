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

export interface UploadValidation {
    errors: ValidationErrors | null;
}

export interface FileUpload {

    readonly file: File;

    readonly size: number;

    readonly name: string;

    readonly type: string;

    response: UploadResponse;

    state: UploadState;

    uploaded: number;

    validation: ValidationErrors | null;

    progress: number;

    hasError: boolean;

    isInvalid: boolean;
}

export interface Upload {

    /**
     * returns observable which notify if file upload state
     * has been changed
     */
    readonly change: Observable<FileUpload>;

    readonly uploadFile: FileUpload;

    /**
     * upload file to server but only
     * if file is not queued, abort request on cancel
     */
    start(): void;

    /**
     * cancel current file upload, this will complete change subject
     */
    cancel(): void;

    /**
     * return true if upload was not completed since the server
     * sends back an error response
     */
    hasError(): boolean;

    /**
     * returns true if validators are set and upload not validated
     */
    isInvalid(): boolean;
}

export interface UploadStoreConfig {
    /**
     * max count of uploads at once, set to -1 for no limit
     */
    concurrentUploads: number;
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
