import { ValidationErrors } from "../validation/validation";

export enum UploadState {
    QUEUED    = "queued",
    START     = "start",
    PROGRESS  = "progress",
    UPLOADED  = "uploaded",
    CANCELED  = "canceled",
    ERROR     = "error",
    INVALID   = "invalid"
}

export interface UploadData {
    state: UploadState;
    uploaded: number;
    size: number;
    name: string;
    progress: number;
    hasError: boolean;
    isSuccess: boolean;
    validation: {
        errors: ValidationErrors | null;
    };
    message: string;
}

export interface IDataNode {
    [key: string]: any;
}

export interface UploadResponse {
    success: boolean;
    errors: string[];
    body: any;
}

/**
 * Represents a file which will be uploaded
 */
export class UploadModel {

    private uploadFile: File;

    private uploadedSize = 0;

    private uploadedState: UploadState = UploadState.QUEUED;

    private uploadError = false;

    private uploadSuccess = false;

    private uploadResponse: UploadResponse = null;

    private uploadValidationErrors = null;

    private uploadMessage = "";

    /**
     * Creates an instance of UploadFile.
     */
    public constructor(file: File) {
        this.uploadFile = file;
    }

    /**
     * get raw file
     */
    public get file(): File {
        return this.uploadFile;
    }

    /**
     * returns filesize in byte
     */
    public get fileSize(): number {
        return this.file.size;
    }

    /**
     * returns filename
     */
    public get fileName(): string {
        return this.file.name;
    }

    /**
     * returns mime type of file
     */
    public get fileType(): string {
        return this.file.type;
    }

    /**
     * set response data if upload has been completed
     */
    public set response(response: UploadResponse) {
        this.uploadResponse = response;
    }

    /**
     * get response data if upload has been completed
     */
    public get response(): UploadResponse {
        return this.uploadResponse;
    }

    /**
     * set current upload state
     */
    public set state(state: UploadState) {
        this.uploadedState = state;
    }

    /**
     * get current upload state
     */
    public get state(): UploadState {
        return this.uploadedState;
    }

    /**
     * set uploaded size
     */
    public set uploaded(bytes: number) {
        this.uploadedSize = bytes;
    }

    /**
     * get uploaded size
     */
    public get uploaded(): number {
        return this.uploadedSize;
    }

    /**
     * set upload was successful
     */
    public set error(isError: boolean) {
        this.uploadError = isError;
    }

    /**
     * get upload was successful
     */
    public get error(): boolean {
        return this.uploadError;
    }

    /**
     * set upload was successful
     */
    public set success(isSuccess: boolean) {
        this.uploadSuccess = isSuccess;
    }

    /**
     * get upload was successful
     */
    public get success(): boolean {
        return this.uploadSuccess;
    }

    public set validationErrors(errors: ValidationErrors | null) {
        this.uploadValidationErrors = errors;
    }

    public get validationErrors(): ValidationErrors | null {
        return this.uploadValidationErrors;
    }

    public set message(msg: string) {
        this.uploadMessage = msg;
    }

    public get message(): string {
        return this.uploadMessage;
    }

    public get progress(): number {
        const progress = this.uploaded * 100 / this.fileSize;
        return Math.round(progress > 100 ? 100 : progress);
    }

    /**
     * return file upload data
     * @todo move to model
     */
    public toJson(): UploadData {
        return {
            state     : this.state,
            uploaded  : this.uploaded,
            size      : this.fileSize,
            name      : this.fileName,
            progress  : this.progress,
            hasError  : this.error,
            isSuccess : this.success,
            validation: {
                errors: this.validationErrors,
            },
            message   : this.message
        };
    }
}
