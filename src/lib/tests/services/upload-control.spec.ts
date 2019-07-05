import { FileUpload, UploadModel  } from "lib/public-api";
import { UploadControl } from "lib/ngx-fileupload/services/upload-control";
describe("Model: UploadFile", () => {

    let fileUpload: FileUpload;
    let uploadCtrl: UploadControl;

    beforeEach(() => {
        fileUpload = jasmine.createSpyObj("FileUpload", {
            retry: () => {},
            start: () => {},
            cancel: () => {}
        });
        uploadCtrl = new UploadControl(fileUpload);
    });

    it ("should call retry", () => {
        uploadCtrl.retry();
        expect(fileUpload.retry).toHaveBeenCalled();
    });

    it ("should call start", () => {
        uploadCtrl.start();
        expect(fileUpload.start).toHaveBeenCalled();
    });

    it ("should call stop", () => {
        uploadCtrl.stop();
        expect(fileUpload.cancel).toHaveBeenCalled();
    });
});
