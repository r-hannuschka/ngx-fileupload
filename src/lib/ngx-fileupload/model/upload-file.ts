export enum FileState {
    QUEUED    = 'queued',
    UPLOADING = 'uploading',
    UPLOADED  = 'uploaded',
    CANCELD   = 'canceled'
}

export class UploadFile {

    private file: File;

    private uploadedSize = 0;

    private uploadedState: FileState = FileState.QUEUED;

    /**
     * Creates an instance of UploadFile.
     */
    public constructor(file: File) {
        this.file = file;
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

    public set state(state: FileState) {
        this.uploadedState = state;
    }

    public get state(): FileState {
        return this.uploadedState;
    }

    public set uploaded(bytes: number) {
        this.uploadedSize = bytes;
    }

    public get uploaded(): number {
        return this.uploadedSize;
    }
}
