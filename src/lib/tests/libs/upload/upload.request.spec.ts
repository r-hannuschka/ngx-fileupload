import { UploadRequest, FileUpload, UploadState } from "@r-hannuschka/ngx-fileupload";
import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { Type } from "@angular/core";
import { HttpClient, HttpEventType, HttpProgressEvent } from "@angular/common/http";
import { UploadModel } from "../../mockup/upload-model";
import { tap, filter } from "rxjs/operators";
import { of } from "rxjs";

describe("NgxFileUpload/libs/upload", () => {

    const url = "https://localhost/file/upload";
    let httpClient: HttpClient;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let request: UploadRequest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        injector   = getTestBed();
        httpMock   = injector.get(HttpTestingController as Type<HttpTestingController>);
        httpClient = injector.get(HttpClient as Type<HttpClient>);

        const uploadFile = new UploadModel();
        request = new UploadRequest(httpClient, uploadFile, {url});
    });

    describe("upload-request", () => {

        it("should have upload file", () => {
            const uploadFile = new UploadModel();
            const testRequest = new UploadRequest(httpClient, uploadFile, {url});

            expect(testRequest.uploadFile).toBe(uploadFile);
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
            const testUploadFile = new UploadModel();
            const noFormDataRequest = new UploadRequest(httpClient, testUploadFile, {
                url, formData: {enabled: false}
            });

            noFormDataRequest.start();

            const mockReq = httpMock.expectOne(url);
            expect(mockReq.request.body).toBe(testUploadFile.file);
            mockReq.flush("we are done here"); // Complete Request with response
        });

        it("should complete upload", (done) => {
            const states: UploadState[] = [];
            request.change
                .pipe(
                    tap((data: FileUpload) => states.push(data.state)),
                )
                .subscribe({
                    complete: () => {
                        expect(states).toEqual([UploadState.START, UploadState.PROGRESS, UploadState.COMPLETED]);
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
                    filter((upload: FileUpload) => upload.state === UploadState.CANCELED)
                )
                .subscribe({
                    next: (upload: FileUpload) => {
                        expect(request.isCanceled()).toBeTruthy();
                        done();
                    }
                });

            /** we could not cancel an request which has not been started */
            request.start();
            request.cancel();

            // have to call this for cancel otherwise it will not verify ?
            // this request is fucking canceled, could not send any events to this one
            const req = httpMock.expectOne(url);
        });

        it("should retry if request has been canceled", (done) => {

            request.change
                .pipe(
                    filter((upload: FileUpload) => upload.state === UploadState.CANCELED)
                )
                .subscribe({
                    next: (upload: FileUpload) => {
                        expect(request.isCanceled()).toBeTruthy();
                        done();
                    }
                });

            /** we could not cancel an request which has not been started */
            request.start();
            request.cancel();

            // have to call this for cancel otherwise it will not verify ?
            // this request is fucking canceled, could not send any events to this one
            const req = httpMock.expectOne(url);
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

            request.beforeStart(() => of(false));

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

            request.beforeStart(() => {
                request.uploadFile.state = UploadState.PENDING;
                return of(false);
            });

            // expect request change will not called
            request.change.subscribe(() => spy());
            request.start();

            expect(spy).toHaveBeenCalled();
        });

        it("should not start upload, is not pending or idle", () => {
            const testUploadFile = new UploadModel();
            testUploadFile.state = UploadState.INVALID;

            const pendingRequest = new UploadRequest(httpClient, testUploadFile, {url});
            const spy = jasmine.createSpy("cancel");

            // expect request change will not called
            pendingRequest.change
                .subscribe(() => spy());

            pendingRequest.start();
            expect(spy).not.toHaveBeenCalled();
        });

        it("should completed but got error", (done) => {
            request.change
                .pipe(filter((upload: FileUpload) => upload.state === UploadState.COMPLETED))
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
                .pipe(filter((upload: FileUpload) => upload.state === UploadState.COMPLETED))
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

        it("should destroy upload", () => {
            const spy = jasmine.createSpy("destroy");
            request.destroyed.subscribe(
                () => spy()
            );
            request.destroy();

            expect(spy).toHaveBeenCalled();
        });
    });

    afterEach(() => {
        httpMock.verify();
    });
});
