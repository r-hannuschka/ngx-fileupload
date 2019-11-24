import { UploadRequest, Control } from "@r-hannuschka/ngx-fileupload";
import { fakeAsync, tick } from "@angular/core/testing";
describe("ngx-fileupload/libs/upload/upload-control", () => {

    let fileUpload: UploadRequest;
    let uploadCtrl: Control;

    beforeEach(() => {
        fileUpload = jasmine.createSpyObj("UploadRequest", {
            retry: () => {},
            start: () => {},
            cancel: () => {},
            destroy: () => {}
        });
        uploadCtrl = new Control(fileUpload);
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

    it ("should call remove", fakeAsync(() => {
        const event = new MouseEvent("click");
        uploadCtrl.remove(event);
        tick(0);
        expect(fileUpload.destroy).toHaveBeenCalled();
    }));
});
