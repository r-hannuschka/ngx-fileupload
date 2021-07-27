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
        const upload = factory.createUploadRequest(file, {url: "/dev/null"});

        expect(upload?.data.files[0].raw).toEqual(file);
    }));

    it("should validate file if validation function is passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const upload = factory.createUploadRequest(file1, {url: "/dev/null"}, ValidatorMockFactory.invalidFileSize());
        expect(upload?.isInvalid()).toBeTruthy();
    }));

    it("should create no requests if no files are passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const requests = factory.createUploadRequest([], {url: "/dev/null"}, ValidatorMockFactory.invalidValidationFn);
        expect(requests).toBeNull();
    }));

    it("should create one requets which holds all files", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const file2 = new File(["ngx file upload"], "file2.txt");
        const file3 = new File(["ngx file upload"], "file3.txt");

        const requests = factory.createUploadRequest([file1, file2, file3], {url: "/dev/null"}, ValidatorMockFactory.invalidValidationFn);
        expect(requests?.data.files.length).toBe(3);
        expect(requests?.data.name).toEqual(['file1.txt', 'file2.txt', 'file3.txt']);
    }));
});
