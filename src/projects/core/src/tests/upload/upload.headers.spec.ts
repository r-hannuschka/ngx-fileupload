
import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { Type } from "@angular/core";
import { NgxFileUploadRequestModel } from "@ngx-file-upload/testing";
import { NgxFileUploadRequest } from "../../lib/upload";

describe("NgxFileUpload/libs/upload", () => {

    const url = "https://localhost/file/upload";
    let httpClient: HttpClient;
    let injector: TestBed;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        injector   = getTestBed();
        httpMock   = injector.inject(HttpTestingController as Type<HttpTestingController>);
        httpClient = injector.inject(HttpClient as Type<HttpClient>);
    });

    it("should append authorization header if value is passed as string", () => {
        const request = new NgxFileUploadRequestModel();
        const upload = new NgxFileUploadRequest(httpClient, request, {
            url,
            headers: {
                authorization: "01234567890abcdef"
            }
        });
        upload.start();

        const testRequest: TestRequest = httpMock.expectOne(url);
        expect(testRequest.request.headers.has("Authorization")).toBeTruthy();
        expect(testRequest.request.headers.get("Authorization")).toEqual(`Bearer 01234567890abcdef`);
    });

    it("should send custom authorization header", () => {
        const uploadFile = new NgxFileUploadModel();
        const upload = new NgxFileUpload(httpClient, uploadFile, {
            url,
            headers: {
                authorization: {
                    key: "CustomAuthorizationKey",
                    token: "my-token"
                }
            }
        });
        upload.start();

        const testRequest: TestRequest = httpMock.expectOne(url);
        expect(testRequest.request.headers.has("Authorization")).toBeTruthy();
        expect(testRequest.request.headers.get("Authorization")).toEqual(`CustomAuthorizationKey my-token`);
    });

    it("should append header", () => {
        const uploadFile = new NgxFileUploadModel();
        const upload = new NgxFileUpload(httpClient, uploadFile, {
            url,
            headers: {
                "X-RefKey": "01234567890abcdef"
            }
        });
        upload.start();

        const testRequest: TestRequest = httpMock.expectOne(url);
        expect(testRequest.request.headers.has("X-RefKey")).toBeTruthy();
        expect(testRequest.request.headers.get("X-RefKey")).toEqual(`01234567890abcdef`);
    });

    afterEach(() => {
        httpMock.verify();
    });
});
