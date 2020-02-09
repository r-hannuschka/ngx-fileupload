import { NgxFileUploadGroupedvalidator, NgxFileUploadValidationErrors } from "@ngx-file-upload/dev/core/public-api";
import { ValidatorMockFactory } from "@ngx-file-upload/testing";

class ValidatorGroupMock extends NgxFileUploadGroupedvalidator {

    public getValidators() {
        return this.validators;
    }

    public validate(file: File ): NgxFileUploadValidationErrors {
        return this.execValidator(this.validators[0], file);
    }
}

describe("@ngx-file-upload/core/validation/group", () => {

    const uploadFile = new File(["upload testing"], "upload.txt", { type: "text/plain"});
    const validator1 = ValidatorMockFactory.invalid();
    const validator2 = ValidatorMockFactory.valid();
    const validator3 = ValidatorMockFactory.validValidationFn();

    let group: ValidatorGroupMock;

    beforeEach(() => {
        group = new ValidatorGroupMock([validator1]);
    });

    it ("it should taken 1 validator with constructor", () => {
        expect(group.getValidators()).toContain(validator1);
    });

    it ("it should add more validators", () => {
        group.add(validator2, validator3);
        expect(group.getValidators()).toEqual([validator1, validator2, validator3]);
    });

    it ("should clean all validators", () => {
        group.clean();
        expect(group.getValidators().length).toBe(0);
    });

    it("should validate with validation function", () => {
        group.clean();
        group.add(validator3);
        const result = group.validate(uploadFile);
        expect(result).toBe(null);
    });

    it("should validate with validation class", () => {
        group.clean();
        group.add(validator2);
        const result = group.validate(uploadFile);
        expect(result).toBe(null);
    });
});
