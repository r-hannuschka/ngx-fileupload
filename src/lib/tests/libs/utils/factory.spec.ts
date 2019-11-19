
import { UploadRequest } from "@r-hannuschka/ngx-fileupload";
import { TestBed, getTestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { Type } from "@angular/core";
import { UploadModel } from "../../mockup/src/upload-model";

describe("NgxFileUpload/libs/utils/factory", () => {

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

    it("should do anything", () => {
        expect(true).toBeTruthy();
    });

    afterEach(() => {
        httpMock.verify();
    });
});
