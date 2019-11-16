import { UploadFile, UploadState, UploadResponse, ValidationErrors } from "../../api";

/**
 * Represents a file which will be uploaded
 */
export class UploadModel implements UploadFile {

    private uploadFile: File;

    private uploadedSize = 0;

    private uploadedState: UploadState = UploadState.IDLE;

    private uploadResponse: UploadResponse = null;

    private uploadValidationErrors = null;

    private uploadProgress = 0;

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

    public set validationErrors(errors: ValidationErrors | null) {
        this.uploadValidationErrors = errors;
    }

    public get validationErrors(): ValidationErrors | null {
        return this.uploadValidationErrors;
    }

    public set progress(progress: number) {
        this.uploadProgress = progress;
    }

    public get progress(): number {
        return this.uploadProgress;
    }

    public get hasError() {
        return this.uploadResponse && this.uploadResponse.errors ? true : false;
    }
}
