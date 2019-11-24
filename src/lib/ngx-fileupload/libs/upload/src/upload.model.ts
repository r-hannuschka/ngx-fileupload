import { FileUpload, UploadState, UploadResponse, ValidationErrors } from "../../api";

/**
 * Represents a file which will be uploaded
 */
export class UploadModel implements FileUpload {

    /**
     * Creates an instance of UploadFile.
     */
    public constructor(file: File) {
        this.file = file;
        this.size = file.size;
        this.type = file.type;
        this.name = file.name;
    }

    /**
     * get raw file
     */
    public readonly file: File;

    /**
     * returns filesize in byte
     */
    public readonly size: number;

    /**
     * returns filename
     */
    public readonly name: string;

    /**
     * returns mime type of file
     */
    public readonly type: string;

    /**
     * set response data if upload has been completed
     */
    public response: UploadResponse = {
        body: null,
        errors: null,
        success: null
    };

    /**
     * set current upload state
     */
    public state: UploadState = UploadState.IDLE;

    /**
     * set uploaded size
     */
    public uploaded = 0;

    public validationErrors: ValidationErrors = null;

    public progress = 0;

    public hasError = false;
}
