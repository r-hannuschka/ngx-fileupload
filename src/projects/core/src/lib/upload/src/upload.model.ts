import { NgxFileUploadRequestData, NgxFileUploadState, NgxFileUploadResponse, NgxFileUploadValidationErrors } from "../../api";

/**
 * Represents a file which will be uploaded
 */
export class NgxFileUploadModel implements NgxFileUploadRequestData {

    /**
     * Creates an instance of UploadFile.
     */
    public constructor(file: File) {
        this.raw  = file;
        this.size = file.size;
        this.type = file.type;
        this.name = file.name;
    }

    /**
     * get raw file
     */
    public readonly raw: File;

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
    public response: NgxFileUploadResponse = {
        body: null,
        errors: null,
        success: false
    };

    /**
     * set current upload state
     */
    public state: NgxFileUploadState = NgxFileUploadState.IDLE;

    /**
     * set uploaded size
     */
    public uploaded = 0;

    public validationErrors: NgxFileUploadValidationErrors | null = null;

    public progress = 0;

    public hasError = false;
}
