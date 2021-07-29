import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient, HttpEventType, HttpProgressEvent } from "@angular/common/http";
import { Type } from "@angular/core";
import { NgxFileUploadRequest, NgxFileUploadState, NgxFileUploadFile } from "@ngx-file-upload/dev/core/public-api";
import { tap, filter, delay, take } from "rxjs/operators";
import { of } from "rxjs";

describe("NgxFileUpload/libs/upload", () => {

    const url = "https://localhost/file/upload";
    let httpClient: HttpClient;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let request: NgxFileUploadRequest;

    function createNgxFileUploadFile(): NgxFileUploadFile {
        const raw = new File(['mocked file'], 'mockedfile.txt')
        return new NgxFileUploadFile(raw)
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        injector   = getTestBed();
        httpMock   = injector.inject(HttpTestingController as Type<HttpTestingController>);
        httpClient = injector.inject(HttpClient as Type<HttpClient>);
        request = new NgxFileUploadRequest(httpClient, createNgxFileUploadFile(), {url});
    });

    it("should have upload file", () => {
        const testRequest = new NgxFileUploadRequest(httpClient, createNgxFileUploadFile(), {url});
        expect(testRequest.data.files.length).toBe(1);
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
        const file = createNgxFileUploadFile()
        const noFormDataRequest = new NgxFileUploadRequest( httpClient, file, { url, formData: {enabled: false} });

        noFormDataRequest.start();

        const mockReq = httpMock.expectOne(url);
        expect(mockReq.request.body).toBe(file.raw);
        mockReq.flush("we are done here"); // Complete Request with response
    });

    it("should complete upload", (done) => {
        const states: NgxFileUploadState[] = [];
        request.change
            .pipe(
                tap((data) => states.push(data.state)),
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
                filter((upload) => upload.state === NgxFileUploadState.CANCELED)
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
                filter((upload) => upload.state === NgxFileUploadState.CANCELED)
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
            request.state = NgxFileUploadState.PENDING
        })))

        // expect request change will not called
        request.change.subscribe(() => spy());
        request.start();

        expect(spy).toHaveBeenCalled();
    });

    it("should call hooks in registered order", (done) => {
        const hookCalls:string[] = [];

        const hook1 = of(true).pipe(
            tap(() => (hookCalls.push("hook1"), request.state = NgxFileUploadState.PENDING)),
            delay(2000)
        );

        const hook2 = of(false).pipe(
            tap(() => (hookCalls.push("hook2"), request.state = NgxFileUploadState.INVALID))
        );

        request.beforeStart(hook1);
        request.beforeStart(hook2);

        request.change.subscribe(() => {
            expect(hookCalls).toEqual(["hook1", "hook2"]);
            done();
        });

        // expect request change will not called
        request.start();
    });

    it("should not start upload, is not pending or idle", () => {
        const file = createNgxFileUploadFile() 
        const request = new NgxFileUploadRequest(httpClient, file, {url})
        request.state = NgxFileUploadState.PROGRESS

        const spy = jasmine.createSpy("cancel");

        // expect request change will not called
        request.change.pipe(take(1)).subscribe(() => spy());
        request.start();

        expect(spy).not.toHaveBeenCalled();
    });

    it("should completed but got error", (done) => {
        request.change
            .pipe(filter((upload) => upload.state === NgxFileUploadState.COMPLETED))
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
            .pipe(filter((upload) => upload.state === NgxFileUploadState.COMPLETED))
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

    it("should send metadata", () => {
        const request = new NgxFileUploadRequest(httpClient, createNgxFileUploadFile(), {
            url,
            formData: {
                enabled: true,
                metadata: {
                    'mocked': 'request_data'
                }
            }
        })

        request.start();
        const mockReq = httpMock.expectOne(url)
        const metadataSend = JSON.parse(mockReq.request.body.get('metadata'));
        expect(metadataSend).toEqual({ 'mocked': 'request_data' })
    });

    it("should remove invalid files", () => {
        const file1 = createNgxFileUploadFile()
        const file2 = createNgxFileUploadFile()

        file1.validationErrors = { 'image': 'invalid image' }

        const request = new NgxFileUploadRequest(httpClient, [file1, file2], {url : '/dev/null'});
        request.state = NgxFileUploadState.INVALID

        // * remove invalid files
        request.removeInvalidFiles()
        expect(request.state).toEqual(2)
    });

    it("should destroy upload request if all files are invalid and removed", () => {
        const file1 = createNgxFileUploadFile()
        const file2 = createNgxFileUploadFile()

        file1.validationErrors = { 'image': 'invalid image' }
        file2.validationErrors = { 'image': 'invalid image' }

        const spy = jasmine.createSpy("destroy");

        const request = new NgxFileUploadRequest(httpClient, [file1, file2], {url : '/dev/null'});
        request.state = NgxFileUploadState.INVALID

        // * remove invalid files
        request.destroyed.subscribe(() => spy());
        request.removeInvalidFiles()

        expect(spy).toHaveBeenCalled();
    });

    it("should do nothing on removeInvalidFiles if all files are valid", () => {
        const file = createNgxFileUploadFile()

        const request = new NgxFileUploadRequest(httpClient, file, {url : '/dev/null'});
        const spy = jasmine.createSpy("change");

        request.removeInvalidFiles()
        request.destroy()
        expect(spy).not.toHaveBeenCalled();

    });

    afterEach(() => {
        httpMock.verify();
    });
});
