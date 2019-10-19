import { UploadRequest, UploadModel  } from "lib/public-api";
import { UploadControl } from "lib/ngx-fileupload/libs/upload/src/upload.control";
import { fakeAsync, tick } from "@angular/core/testing";
describe("Model: UploadFile", () => {

    let fileUpload: UploadRequest;
    let uploadCtrl: UploadControl;

    beforeEach(() => {
        fileUpload = jasmine.createSpyObj("UploadRequest", {
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

    it ("should call stop", fakeAsync(() => {
        uploadCtrl.stop();
        tick(0);
        expect(fileUpload.cancel).toHaveBeenCalled();
    }));
});
