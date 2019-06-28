export enum UploadState {
    QUEUED    = 'queued',
    START     = 'start',
    PROGRESS  = 'progress',
    UPLOADED  = 'uploaded',
    CANCELED  = 'canceled',
    ERROR     = 'error'
}

export interface UploadData {
    state: UploadState;
    uploaded: number;
    size: number;
    name: string;
    progress: number;
    hasError: boolean;
    error: string;
}

/**
 * Represents a file which will be uploaded
 */
export class UploadModel {

    private file: File;

    private uploadError = '';

    private uploadedSize = 0;

    private uploadedState: UploadState = UploadState.QUEUED;

    /**
     * Creates an instance of UploadFile.
     */
    public constructor(file: File) {
        this.file = file;
    }

    /**
     * get raw file
     */
    public get blob(): Blob {
        return this.file;
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

    public set error(message: string) {
        this.uploadError = message;
    }

    public get error(): string {
        return this.uploadError;
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
     * return file upload data
     * @todo move to model
     */
    public toJson(): UploadData {
        const progress = this.uploaded * 100 / this.fileSize;
        return {
            state    : this.state,
            uploaded : this.uploaded,
            size     : this.fileSize,
            name     : this.fileName,
            progress : Math.round(progress > 100 ? 100 : progress),
            hasError : this.error.length > 0,
            error    : this.error
        };
    }
}
