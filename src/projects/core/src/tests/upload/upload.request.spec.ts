import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient, HttpEventType, HttpProgressEvent } from "@angular/common/http";
import { Type } from "@angular/core";
import { NgxFileUploadRequest, INgxFileUploadRequestModel, NgxFileUploadState } from "@ngx-file-upload/dev/core/public-api";
import { NgxFileUploadRequestModel } from "@ngx-file-upload/testing";
import { tap, filter, delay } from "rxjs/operators";
import { of } from "rxjs";

describe("NgxFileUpload/libs/upload", () => {

    const url = "https://localhost/file/upload";
    let httpClient: HttpClient;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let request: NgxFileUploadRequest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        injector   = getTestBed();
        httpMock   = injector.inject(HttpTestingController as Type<HttpTestingController>);
        httpClient = injector.inject(HttpClient as Type<HttpClient>);

        const uploadFile = new NgxFileUploadRequestModel();
        request = new NgxFileUploadRequest(httpClient, uploadFile, {url});
    });

    it("should have upload file", () => {
        const uploadFile = new NgxFileUploadRequestModel();
        const testRequest = new NgxFileUploadRequest(httpClient, uploadFile, {url});

        expect(testRequest.data).toBe(uploadFile);
    });

    it("should submit post request", (done) => {
        request.change
            .subscribe({
                complete: () => done()
            });
        request.start();

        const mockReq = httpMock.expectOne(url);
        expect(mockReq.request.method).toBe("POST");

        mockReq.flush("completed");
    });

    it("should send file data directly in body if formdata is disbled", () => {
        const testUploadFile = new NgxFileUploadRequestModel();
        const noFormDataRequest = new NgxFileUploadRequest(httpClient, testUploadFile, {
            url, formData: {enabled: false}
        });

        noFormDataRequest.start();

        const mockReq = httpMock.expectOne(url);
        expect(mockReq.request.body).toBe(testUploadFile.files[0].raw);
        mockReq.flush("we are done here"); // Complete Request with response
    });

    it("should complete upload", (done) => {
        const states: NgxFileUploadState[] = [];
        request.change
            .pipe(
                tap((data: INgxFileUploadRequestModel) => states.push(data.state)),
            )
            .subscribe({
                complete: () => {
                    expect(states).toEqual([NgxFileUploadState.START, NgxFileUploadState.PROGRESS, NgxFileUploadState.COMPLETED]);
                    expect(request.isCompleted()).toBeTruthy();
                    done();
                }
            });

        request.start();

        const mockReq = httpMock.expectOne(url);
        mockReq.event({type: HttpEventType.UploadProgress, loaded: 7, total: 10 } as HttpProgressEvent);
        mockReq.flush("we are done here"); // Complete Request with response
    });

    it("should cancel upload", (done) => {
        request.change
            .pipe(
                filter((upload: INgxFileUploadRequestModel) => upload.state === NgxFileUploadState.CANCELED)
            )
            .subscribe({
                next: () => {
                    expect(request.isCanceled()).toBeTruthy();
                    expect(request.isCompleted()).toBeTruthy();
                    done();
                }
            });

        /** we could not cancel an request which has not been started */
        request.start();
        request.cancel();

        // have to call this for cancel otherwise it will not verify ?
        // this request is fucking canceled, could not send any events to this one
        httpMock.expectOne(url);
    });

    it("should retry if request has been canceled", (done) => {

        request.change
            .pipe(
                filter((upload: INgxFileUploadRequestModel) => upload.state === NgxFileUploadState.CANCELED)
            )
            .subscribe({
                next: () => {
                    expect(request.isCanceled()).toBeTruthy();
                    done();
                }
            });

        /** we could not cancel an request which has not been started */
        request.start();
        request.cancel();

        // have to call this for cancel otherwise it will not verify ?
        // this request is fucking canceled, could not send any events to this one
        httpMock.expectOne(url);
    });

    it("should cancel only running uploads", () => {
        const spy = jasmine.createSpy("cancel");
        // expect request change will not called
        request.change
            .subscribe(() => spy());

        request.cancel();
        expect(spy).not.toHaveBeenCalled();
    });

    it("should not start upload, if beforeStartHook emits false but not changed state", () => {
        const spy = jasmine.createSpy("cancel");

        request.beforeStart(of(false));

        // expect request change will not called
        request.change.subscribe(() => spy());
        request.start();

        expect(spy).not.toHaveBeenCalled();
    });

    /**
     * works like upload queue, a hook changed upload state
     */
    it("should notify observer if hook change state", () => {
        const spy = jasmine.createSpy("cancel");

        request.beforeStart(of(false).pipe(tap(() => {
            request.data.state = NgxFileUploadState.PENDING
        })))

        // expect request change will not called
        request.change.subscribe(() => spy());
        request.start();

        expect(spy).toHaveBeenCalled();
    });

    it("should call hooks in registered order", (done) => {
        const hookCalls:string[] = [];

        const hook1 = of(true).pipe(
            tap(() => (hookCalls.push("hook1"), request.data.state = NgxFileUploadState.PENDING)),
            delay(2000)
        );

        const hook2 = of(false).pipe(
            tap(() => (hookCalls.push("hook2"), request.data.state = NgxFileUploadState.INVALID))
        );

        request.beforeStart(hook1);
        request.beforeStart(hook2);

        request.change.subscribe(() => {
            expect(hookCalls).toEqual(["hook1", "hook2"]);
            expect(request.isInvalid()).toBeTruthy();
            done();
        });

        // expect request change will not called
        request.start();
    });

    it("should not start upload, is not pending or idle", () => {
        const testUploadFile = new NgxFileUploadRequestModel();
        testUploadFile.state = NgxFileUploadState.INVALID;

        const pendingRequest = new NgxFileUploadRequest(httpClient, testUploadFile, {url});
        const spy = jasmine.createSpy("cancel");

        // expect request change will not called
        pendingRequest.change
            .subscribe(() => spy());

        pendingRequest.start();
        expect(spy).not.toHaveBeenCalled();
    });

    it("should completed but got error", (done) => {
        request.change
            .pipe(filter((upload: INgxFileUploadRequestModel) => upload.state === NgxFileUploadState.COMPLETED))
            .subscribe({
                next: () => {
                    expect(request.hasError()).toBeTruthy();
                    done();
                }
            });

        const errorMessage = ["not autohorized"];

        // expect request change will not called
        request.start();
        const mockReq = httpMock.expectOne(url);
        mockReq.flush(JSON.stringify(errorMessage), {
            status: 401,
            statusText: "unauthorized",
        }); // Complete Request with response
    });

    it("should has been an error on 404", (done) => {
        request.change
            .pipe(filter((upload: INgxFileUploadRequestModel) => upload.state === NgxFileUploadState.COMPLETED))
            .subscribe({
                next: () => {
                    expect(request.hasError()).toBeTruthy();
                    done();
                }
            });

        // expect request change will not called
        request.start();
        const mockReq = httpMock.expectOne(url);

        // this will only finish request not change stream
        mockReq.flush("not found", {
            status: 404,
            statusText: "unauthorized"
        });
    });

    it("should restart canceled upload", () => {

        request.start();
        request.cancel();
        expect(request.isCanceled()).toBeTruthy();
        httpMock.expectOne(url);

        /** start again */
        request.retry();
        expect(request.data.state).toBe(NgxFileUploadState.START);

        const req = httpMock.expectOne(url);
        req.flush("");
    });

    it("should restart upload with error", () => {
        request.start();
        const errorReq = httpMock.expectOne(url);
        errorReq.flush("not found", {
            status: 404,
            statusText: "unauthorized"
        });

        expect(request.hasError()).toBeTruthy();

        request.retry();
        expect(request.data.state).toBe(NgxFileUploadState.START);

        const retryReq = httpMock.expectOne(url);
        retryReq.flush("");
    });

    it("should not restart upload which allready completed", () => {
        const startSpy = spyOn(request, "start").and.callThrough();
        request.data.state = NgxFileUploadState.COMPLETED;
        request.data.response = {success: true, body: null, errors: []};
        request.retry();
        expect(startSpy).not.toHaveBeenCalled();
    });

    it("should destroy upload", () => {
        const spy = jasmine.createSpy("destroy");
        request.destroyed.subscribe(
            () => spy()
        );
        request.destroy();
        expect(spy).toHaveBeenCalled();
    });

    afterEach(() => {
        httpMock.verify();
    });
});
