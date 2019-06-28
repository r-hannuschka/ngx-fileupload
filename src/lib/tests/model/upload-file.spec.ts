import { FileModel } from 'lib/public-api';
import { UploadState } from 'lib/ngx-fileupload/model/upload';

describe('Model: UploadFile', () => {

    const FILE_CONTENT = 'hello world';
    const FILE_NAME = 'hello_world.txt';

    let file: File;
    let model: FileModel;

    beforeEach(() => {
        file = new File([FILE_CONTENT], FILE_NAME, {type: 'text/plain'});
        model = new FileModel(file);
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
        expect(model.state).toBe(UploadState.QUEUED);
    });

    it('should set new state', () => {
        model.state = UploadState.PROGRESS;
        expect(model.state).toBe(UploadState.PROGRESS);
    });

    it('should return uploaded size: 0 by default', () => {
        expect(model.uploaded).toBe(0);
    });

    it('should update uploaded size', () => {
        model.uploaded = 100;
        expect(model.uploaded).toBe(100);
    });
});
