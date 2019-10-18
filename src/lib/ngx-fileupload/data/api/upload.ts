import { Observable } from "rxjs";
import { UploadModel } from "../upload.model";
import { ValidationErrors } from "./validation";

export enum UploadState {
    QUEUED    = "queued",
    START     = "start",
    PROGRESS  = "progress",
    UPLOADED  = "uploaded",
    CANCELED  = "canceled",
    ERROR     = "error",
    INVALID   = "invalid",
    COMPLETED = "completed",
    REQUEST_COMPLETED = "[NgxFileUploadRequest] completed"
}

export interface UploadResponse {
    success: boolean;
    errors: any;
    body: any;
}

export interface UploadValidation {
    errors: ValidationErrors | null;
}

export interface UploadData {
    name: string;
    progress: number;
    response: UploadResponse;
    size: number;
    state: UploadState;
    uploaded: number;
    validation: UploadValidation;
    hasError: boolean;
    isInvalid: boolean;
}

export interface Upload {

    /**
     * returns observable which notify if file upload state
     * has been changed
     */
    readonly change: Observable<UploadModel>;

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
