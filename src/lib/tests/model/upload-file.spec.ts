import { UploadFile } from 'lib/public-api';
import { FileState } from 'lib/ngx-fileupload/model/upload-file';

describe('Model: UploadFile', () => {

    const FILE_CONTENT = 'hello world';
    const FILE_NAME = 'hello_world.txt';

    let file: File;
    let model: UploadFile;

    beforeEach(() => {
        file = new File([FILE_CONTENT], FILE_NAME, {type: 'text/plain'});
        model = new UploadFile(file);
    });

    it('should return filename', () => {
        expect(model.fileName).toBe(FILE_NAME);
    });

    it('should return filesize', () => {
        expect(model.fileSize).toBe(FILE_CONTENT.length);
    });

    it('should return filetype', () => {
        expect(model.fileType).toBe('text/plain');
    });

    it('should set by default to queued', () => {
        expect(model.state).toBe(FileState.QUEUED);
    });

    it('should set new state', () => {
        model.state = FileState.UPLOADING;
        expect(model.state).toBe(FileState.UPLOADING);
    });

    it('should return uploaded size: 0 by default', () => {
        expect(model.uploaded).toBe(0);
    });

    it('should update uploaded size', () => {
        model.uploaded = 100;
        expect(model.uploaded).toBe(100);
    });
});
