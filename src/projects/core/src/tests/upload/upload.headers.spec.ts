
import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { Type } from "@angular/core";
import { NgxFileUploadFile, NgxFileUploadRequest } from "../../lib/upload";

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

    function createNgxFileUploadFile(): NgxFileUploadFile {
        const raw = new File(['mocked file'], 'mockedfile.txt')
        return new NgxFileUploadFile(raw)
    }

    it("should append authorization header if value is passed as string", () => {

        const upload = new NgxFileUploadRequest(httpClient, createNgxFileUploadFile(), {
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
        const upload = new NgxFileUploadRequest(httpClient, createNgxFileUploadFile(), {
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
        const upload = new NgxFileUploadRequest(httpClient, createNgxFileUploadFile(), {
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
