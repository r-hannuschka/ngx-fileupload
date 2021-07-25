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
        const upload = factory.createUploadRequests(file, {url: "/dev/null"});

        expect(upload[0].data.files[0].raw).toEqual(file);
    }));

    it("should create multiple NgxFileUploadRequest", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const file2 = new File(["ngx file upload"], "file2.txt");

        /** das ist korrekt der macht nur einen nun */
        const uploads = factory.createUploadRequests([file1, file2], {url: "/dev/null"});
        const uploadedFiles = uploads.map((req) => req.data.files[0].raw);

        expect(uploads.length).toBe(2);
        expect(uploadedFiles).toEqual([file1, file2]);
    }));

    it("should validate file if validation function is passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const upload = factory.createUploadRequests(file1, {url: "/dev/null"}, ValidatorMockFactory.invalidFileSize());
        expect(upload[0].isInvalid()).toBeTruthy();
    }));

    it("should validate file if validation class is passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const upload = factory.createUploadRequests(file1, {url: "/dev/null"}, ValidatorMockFactory.invalidValidationFn);
        expect(upload[0].isInvalid()).toBeTruthy();
    }));

    it("should create no requests if no files are passed", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const requests = factory.createUploadRequests([], {url: "/dev/null"}, ValidatorMockFactory.invalidValidationFn);
        expect(requests.length).toBe(0);
    }));

    it("should create one requets which holds all files", inject([NgxFileUploadFactory], (factory: NgxFileUploadFactory) => {
        const file1 = new File(["ngx file upload"], "file1.txt");
        const file2 = new File(["ngx file upload"], "file2.txt");
        const file3 = new File(["ngx file upload"], "file3.txt");

        const requests = factory.createUploadRequests([file1, file2, file3], {url: "/dev/null"}, ValidatorMockFactory.invalidValidationFn, -1);
        expect(requests.length).toBe(1);
        expect(requests[0].data.files.length).toBe(3);
        expect(requests[0].data.name).toEqual(['file1.txt', 'file2.txt', 'file3.txt']);
    }));
});
