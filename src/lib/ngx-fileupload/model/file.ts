export enum UploadState {
    QUEUED    = 'queued',
    START     = 'start',
    PROGRESS  = 'progress',
    UPLOADED  = 'uploaded',
    CANCELED  = 'canceled'
}

/**
 * Represents a file which will be uploaded
 */
export class FileModel {

    private file: File;

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
}
