
import { UploadRequest, Upload, NgxFileUploadFactory } from "@r-hannuschka/ngx-fileupload";
import { TestBed, getTestBed, inject } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { Type } from "@angular/core";
import { UploadModel } from "../../mockup/src/upload-model";
import { ValidatorMockFactory } from "../../mockup";

describe("NgxFileUpload/libs/utils/factory", () => {

    const url = "https://localhost/file/upload";
    let httpClient: HttpClient;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let request: UploadRequest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });

        injector   = getTestBed();
        httpMock   = injector.get(HttpTestingController as Type<HttpTestingController>);
        httpClient = injector.get(HttpClient as Type<HttpClient>);

        const uploadFile = new UploadModel();
        request = new Upload(httpClient, uploadFile, {url});
    });

    it("should create single UploadRequest", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file = new File(["@r-hannuschka/ngx-fileupload"], "file1.txt");
        const upload = factory.createUploadRequest(file, {url: "/dev/null"}, null);

        expect(upload.uploadFile.file).toEqual(file);
    }));

    it("should create multiple UploadRequest", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["@r-hannuschka/ngx-fileupload"], "file1.txt");
        const file2 = new File(["@r-hannuschka/ngx-fileupload"], "file2.txt");

        const uploads = factory.createUploadRequest([file1, file2], {url: "/dev/null"});
        const uploadedFiles = uploads.map((req) => req.uploadFile.file);

        expect(uploads.length).toBe(2);
        expect(uploadedFiles).toEqual([file1, file2]);
    }));

    it("should validate file if validation function is passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["@r-hannuschka/ngx-fileupload"], "file1.txt");
        const upload = factory.createUploadRequest(file1, {url: "/dev/null"}, ValidatorMockFactory.invalidFileSize());
        expect(upload.isInvalid()).toBeTruthy();
    }));

    it("should validate file if validation class is passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["@r-hannuschka/ngx-fileupload"], "file1.txt");
        const upload = factory.createUploadRequest(file1, {url: "/dev/null"}, ValidatorMockFactory.invalidValidationFn);
        expect(upload.isInvalid()).toBeTruthy();
    }));

    afterEach(() => {
        httpMock.verify();
    });
});
