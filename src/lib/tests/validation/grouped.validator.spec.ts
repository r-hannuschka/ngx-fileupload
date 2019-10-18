
import { ValidatorMockFactory } from "../mock/validator.factory";
import { GroupedValidator } from "@lib/utils/validation/src/grouped.validator";
import { ValidationErrors } from "@lib/utils/validation/validation";

class ValidatorGroupMock extends GroupedValidator {

    public getValidators() {
        return this.validators;
    }

    public validate(file: File ): ValidationErrors {
        return this.execValidator(this.validators[0], file);
    }
}

describe("GroupedValidation", () => {

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

    describe("test validation", () => {

        beforeEach(() => {
            group.clean();
        });

        it("should validate with validation function", () => {
            group.add(validator3);
            const result = group.validate(uploadFile);
            expect(result).toBe(null);
        });

        it("should validate with validation class", () => {
            group.add(validator2);
            const result = group.validate(uploadFile);
            expect(result).toBe(null);
        });
    });
});
