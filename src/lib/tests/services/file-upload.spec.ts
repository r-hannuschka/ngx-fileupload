import { UploadRequest, UploadModel  } from "lib/public-api";
import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpProgressEvent, HttpEventType } from "@angular/common/http";
import { Type } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UploadState } from "@lib/data/api";
import { tap } from "rxjs/operators";

describe("Model: UploadFile", () => {

    const url = "https://localhost/file/upload";
    let fileupload: UploadRequest;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let uploadFile: File;
    let uploadModel: UploadModel;
    let fileUploadNoFormData = null;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
    });

    beforeEach(() => {
        injector   = getTestBed();
        httpMock   = injector.get(HttpTestingController as Type<HttpTestingController>);
        uploadFile = new File(["ngx-fileupload testing"], "foobar.txt", {type: "text/plain"});

        const httpClient = injector.get(HttpClient as Type<HttpClient>);
        uploadModel = new UploadModel(uploadFile);

        fileupload = new UploadRequest(httpClient, uploadModel, {url});

        /** should be default formData */
        fileUploadNoFormData = new UploadRequest(httpClient, uploadModel, {
            url,
            formData: {
                enabled: false
            }
        });
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should submit post request", () => {
        fileupload.start();
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe("POST");
        expect(req.request.url).toBe(url);
    });

    it("should complete upload", (done) => {
        const states: UploadState[] = [];
        fileupload.change
            .pipe(tap({
                next: (file: UploadModel) => states.push(file.state),
            }))
            .subscribe({
                complete: () => {
                    expect(states).toEqual([UploadState.IDLE, UploadState.START, UploadState.PROGRESS, UploadState.UPLOADED]);
                    done();
                }
            });

        fileupload.start();
        const mockReq = httpMock.expectOne(url);
        mockReq.event({type: HttpEventType.UploadProgress, loaded: 7, total: 10 } as HttpProgressEvent);
        mockReq.flush("");
    });

    it("should cancel upload", (done) => {
        let state: UploadState = null;
        fileupload.change
            .subscribe({
                next: (upload: UploadModel) => state = upload.state,
                complete: () => {
                    expect(state).toBe(UploadState.CANCELED);
                    done();
                }
            });
        fileupload.cancel();
    });

    it("should not start upload if allready running", () => {
        fileupload.start();
        fileupload.start();
        httpMock.expectOne(url);
    });

    it("should not start if upload is invalid", () => {
        uploadModel.state = UploadState.INVALID;
        fileupload.start();
        httpMock.expectNone(url);
    });

    it("should have error if upload is invalid", () => {
        uploadModel.state = UploadState.INVALID;
        expect(fileupload.isInvalid()).toBeTruthy();
    });

    it("should not cancel upload if allready canceled", () => {
        const spy = spyOnProperty(uploadModel, "state", "set").and.callThrough();
        // we await canceled is called only once
        fileupload.cancel();
        fileupload.cancel();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should not start if upload is invalid", () => {

        fileupload.start();
        httpMock.expectOne(url).flush({
            success: false,
            error: "Missing Access rights"
        }, {
            status: 401,
            statusText: "Forbidden"
        });
        expect(fileupload.hasError()).toBeTruthy();
        expect(uploadModel.state).toBe(UploadState.ERROR);
    });

    it("should retry upload only if it has an error", () => {
        fileupload.retry();
        httpMock.expectNone(url);
    });

    it("should retry upload only if it has an error", () => {
        fileupload.start();
        httpMock.expectOne(url).flush({
            success: false,
            error: "Missing Access rights"
        }, {
            status: 401,
            statusText: "Forbidden"
        });
        expect(fileupload.hasError()).toBeTruthy();
        // retry upload if it has an error
        fileupload.retry();
        httpMock.expectOne(url);
    });

    it("should submit files as FormData", () => {
        fileupload.start();

        const req  = httpMock.expectOne(url);
        const body = req.request.body as FormData;

        expect(body.has("file")).toBeTruthy();
        expect(body.get("file") as File).toEqual(uploadFile);
    });

    it("should post file without form data", () => {
        fileUploadNoFormData.start();
        const testReq = httpMock.expectOne(url);
        expect(testReq.request.body).toBe(uploadFile);
    });
});
