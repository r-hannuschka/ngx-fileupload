import { FileUpload } from './file-upload';

export class UploadControl {

    public constructor(
        private fileUpload: FileUpload
    ) {}

    public start() {
        this.fileUpload.start();
    }

    public stop() {
        this.fileUpload.cancel();
    }
}
