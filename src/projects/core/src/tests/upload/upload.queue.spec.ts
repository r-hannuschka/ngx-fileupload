import { UploadQueue, UploadState } from "@ngx-file-upload/dev/core/public-api";
import { UploadRequestMock, UploadModel } from "@ngx-file-upload/testing";

describe("ngx-fileupload/libs/upload/upload.queue", () => {

    let queue: UploadQueue;

    beforeEach(() => {
        queue = new UploadQueue();
    });

    it ("should add upload and register beforeStartHook", () => {

        const uploadFile = new UploadModel();
        const request = new UploadRequestMock(uploadFile);

        const hookSpy = spyOn(request, "beforeStart");
        queue.register(request);

        expect(hookSpy).toHaveBeenCalled();
    });

    it ("should set state of second request to pending", () => {
        const request1 = new UploadRequestMock(new UploadModel());
        const request2 = new UploadRequestMock(new UploadModel());

        spyOn(request1, "start").and.callFake(() => request1.hooks[0].subscribe(() => (
            request1.data.state = UploadState.START,
            request1.applyChange()
        )));

        spyOn(request2, "start").and.callFake(() => request2.hooks[0].subscribe(() =>
            expect(request2.data.state).toBe(UploadState.PENDING)
        ));

        queue.concurrent = 1; // concurrent uploads are 0, we could literally upload nothing

        queue.register(request1);
        queue.register(request2);

        request1.start();
        request2.start();
    });

    it ("should start second request after first completed", () => {
        const request1 = new UploadRequestMock(new UploadModel());
        const request2 = new UploadRequestMock(new UploadModel());

        const r2StartSpy = spyOn(request2, "start").and.callThrough();

        queue.concurrent = 1; // concurrent uploads are 0, we could literally upload nothing

        queue.register(request1);
        queue.register(request2);

        // start both
        request1.start();
        request2.start();

        // finish request 1
        request1.data.state = UploadState.COMPLETED;
        request1.applyChange();

        /** should started 2 times */
        expect(r2StartSpy).toHaveBeenCalledTimes(2);
        expect(request2.isProgress()).toBeTruthy();
    });

    it ("should remove request from queue, if request is canceled", () => {
        const request1 = new UploadRequestMock(new UploadModel());
        const request2 = new UploadRequestMock(new UploadModel());

        const r2StartSpy = spyOn(request2, "start").and.callThrough();

        queue.concurrent = 1; // concurrent uploads are 0, we could literally upload nothing
        queue.register(request1);
        queue.register(request2);

        // start both
        request1.start();
        request2.start();

        // kill request
        request2.destroy();

        // finish request 1
        request1.data.state = UploadState.COMPLETED;
        request1.applyChange();

        /** should called only 1 time */
        expect(r2StartSpy).toHaveBeenCalledTimes(1);
    });
});
