import { NgxFileUploadAndValidator } from "@ngx-file-upload/dev/core/public-api";
import { ValidatorMockFactory } from "@ngx-file-upload/testing";

describe("@ngx-file-upload/core/validation/and", () => {

    const uploadFile = new File(["upload testing"], "upload.txt", { type: "text/plain"});
    let validationGroup: NgxFileUploadAndValidator;

    beforeAll(() => {
        validationGroup = new NgxFileUploadAndValidator();
    });

    beforeEach(() => {
        validationGroup.clean();
    });

    it ("it should validate", () => {
        validationGroup.add(ValidatorMockFactory.valid());
        validationGroup.add(ValidatorMockFactory.valid());
        expect(validationGroup.validate(uploadFile)).toBeNull();
    });

    it ("it should not validate", () => {
        validationGroup.add(ValidatorMockFactory.valid());
        validationGroup.add(ValidatorMockFactory.invalid());
        expect(validationGroup.validate(uploadFile)).not.toBeNull();
    });

    it ("should contain 1 error", () => {

        validationGroup.add(
            ValidatorMockFactory.valid(),
            ValidatorMockFactory.invalidFileSize()
        );

        const validationResult = validationGroup.validate(uploadFile);
        const validationKeys   = Object.keys(validationResult || {});

        expect(validationKeys.length).toBe(1);
        expect(validationKeys).toEqual(["invalidFileSize"]);
    });

    it ("should contain multiple errors", () => {

        validationGroup.add(
            ValidatorMockFactory.invalid(),
            ValidatorMockFactory.invalidFileSize()
        );

        const validationResult = validationGroup.validate(uploadFile);
        const validationKeys   = Object.keys(validationResult || {});

        expect(validationKeys.length).toBe(2);
        expect(validationKeys).toEqual(["invalid", "invalidFileSize"]);
    });
});
