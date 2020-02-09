
import { TestBed, inject } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgxFileUploadFactory } from "@ngx-file-upload/dev/core/public-api";
import { ValidatorMockFactory } from "@ngx-file-upload/testing";

describe("NgxFileUpload/libs/utils/factory", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
    });

    it("should create single NgxFileUploadRequest", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file = new File(["ngx file upload"], "file1.txt");
        const upload = factory.createUploadRequest(file, {url: "/dev/null"}, null);

        expect(upload.data.raw).toEqual(file);
    }));

    it("should create multiple NgxFileUploadRequest", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const file2 = new File(["ngx file upload"], "file2.txt");

        const uploads = factory.createUploadRequest([file1, file2], {url: "/dev/null"});
        const uploadedFiles = uploads.map((req) => req.data.raw);

        expect(uploads.length).toBe(2);
        expect(uploadedFiles).toEqual([file1, file2]);
    }));

    it("should validate file if validation function is passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const upload = factory.createUploadRequest(file1, {url: "/dev/null"}, ValidatorMockFactory.invalidFileSize());
        expect(upload.isInvalid()).toBeTruthy();
    }));

    it("should validate file if validation class is passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const upload = factory.createUploadRequest(file1, {url: "/dev/null"}, ValidatorMockFactory.invalidValidationFn);
        expect(upload.isInvalid()).toBeTruthy();
    }));
});
