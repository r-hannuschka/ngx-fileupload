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

export interface UploadData {

    /**
     * name of upload
     */
    name: string;
    /**
     * progress in percent
     */
    progress: number;
    /**
     * upload finishes request with a succes, holds success informations
     */
    response: UploadResponse;
    /**
     * total size of upload
     */
    size: number;
    /**
     * current state of upload
     */
    state: UploadState;
    /**
     * uploaded size
     */
    uploaded: number;
    /**
     * contains validation results
     */
    validation: UploadValidation;
    /**
     * returns true if upload request was finished with an error
     */
    hasError: boolean;
    /**
     * returns true if upload is invalid
     */
    isInvalid: boolean;
    /**
     * upload is marked for start but still in upload queue
     * and not running currently
     */
    isPending: boolean;
    /**
     * upload request id
     */
    requestId: string;
}

export interface Upload {

    /**
     * returns observable which notify if file upload state
     * has been changed
     */
    readonly change: Observable<UploadData>;

    /**
     * get upload data informations
     */
    readonly data: UploadData;

    /**
     * upload file to server but only
     * if file is not queued, abort request on cancel
     */
    start(): void;

    /**
     * restart download again
     * reset state, and reset errors
     */
    retry(): void;

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

export interface UploadFile {

    readonly file: File;

    readonly fileSize: number;

    readonly fileName: string;

    readonly fileType: string;

    response: UploadResponse;

    state: UploadState;

    uploaded: number;

    validationErrors: ValidationErrors | null;

    progress: number;

    hasError: boolean;
}
