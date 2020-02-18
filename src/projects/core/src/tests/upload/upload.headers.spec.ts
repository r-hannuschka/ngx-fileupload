
import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { Type } from "@angular/core";
import { NgxFileUpload } from "@ngx-file-upload/dev/core/public-api";
import { NgxFileUploadModel } from "@ngx-file-upload/testing";

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

    it("should add authorization header to request", () => {
        const uploadFile = new NgxFileUploadModel();
        const upload = new NgxFileUpload(httpClient, uploadFile, {
            url,
            headers: {
                authorization: {
                    token: "my-token"
                }
            }
        });
        upload.start();

        const testRequest: TestRequest = httpMock.expectOne(url);
        expect(testRequest.request.headers.has("Authorization")).toBeTruthy();
        expect(testRequest.request.headers.get("Authorization")).toEqual(`Bearer my-token`);
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
