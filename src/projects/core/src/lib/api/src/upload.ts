import { Observable } from "rxjs";
import { NgxFileUploadValidationErrors } from "./validation";

export interface NgxFileUploadResponse {
    success: boolean;
    errors: any;
    body: any;
}

export enum NgxFileUploadState {
    INVALID   = 0,
    CANCELED  = 1,
    IDLE      = 2,
    PENDING   = 3,
    START     = 4,
    PROGRESS  = 5,
    COMPLETED = 6
}

export interface NgxFileUploadControl {

    retry(): void;

    start(): void;

    stop(): void;

    remove(): void;
}

export interface UploadValidation {
    errors: NgxFileUploadValidationErrors | null;
}

export interface INgxFileUploadFile {
    readonly raw: File;

    readonly size: number;

    readonly name: string;

    readonly type: string;

    validationErrors: NgxFileUploadValidationErrors | null;
}

export interface INgxFileUploadRequestData {
    readonly files: INgxFileUploadFile[];

    readonly size: number;

    readonly name: string[];

    response: NgxFileUploadResponse | null;

    state: NgxFileUploadState;

    uploaded: number;

    validationErrors: NgxFileUploadValidationErrors | null;

    progress: number;

    hasError: boolean;
}

export interface INgxFileUploadRequestModel extends INgxFileUploadRequestData {
    toJson(): INgxFileUploadRequestData;
}

export interface INgxFileUploadRequest {

    requestId: string;

    /**
     * returns observable which notify if file upload state
     * has been changed
     */
    readonly change: Observable<INgxFileUploadRequestData>;

    readonly data: INgxFileUploadRequestData;

    readonly destroyed: Observable<boolean>;

    state: NgxFileUploadState;

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

    removeInvalidFiles(): void;

    retry(): void;

    start(): void;
}

export interface NgxFileUploadStorageConfig {
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

interface AuthorizationHeader {
    key?: string;
    token: string;
}

export interface NgxFileUploadHeaders {
    [key: string]: string | AuthorizationHeader | undefined;
    authorization?: string | AuthorizationHeader;
}

/**
 * Upload Options
 */
export interface NgxFileUploadOptions {

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
        /**
         * additional formdata which will send
         */
        additionalData?: Record<string, unknown>;
        /**
         * additional metadata which will append to formData, requires formData
         * to be enabled
         * 
         * @deprecated use additionalData instead
         */
        metadata?: Record<string, unknown>;
    };

    headers?: NgxFileUploadHeaders;
}
