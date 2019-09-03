
import { ValidatorMockFactory } from "../mock/validator.factory";
import { ValidationBuilder } from "lib/ngx-fileupload/validation/validation.builder";
import { GroupedValidator } from "lib/ngx-fileupload/validation/grouped.validator";

describe("GroupedValidation", () => {

    const uploadFile = new File(["upload testing"], "upload.txt", { type: "text/plain"});
    let group: GroupedValidator;

    beforeAll(() => {
        group = ValidationBuilder.and();
    });

    beforeEach(() => {
        group.clean();
    });

    it ("it should validate with multiple groups", () => {
        group.add(
            ValidationBuilder.or(ValidatorMockFactory.invalid(), ValidatorMockFactory.valid()),
            ValidatorMockFactory.valid()
        );
        expect(group.validate(uploadFile)).toBeNull();
    });

    it ("it should validate one of both groups", () => {
        const orGroup = ValidationBuilder.or();
        orGroup.add(
            ValidationBuilder.and(ValidatorMockFactory.invalid(), ValidatorMockFactory.valid()),
            ValidationBuilder.and(ValidatorMockFactory.valid(), ValidatorMockFactory.valid()),
        );
        expect(orGroup.validate(uploadFile)).toBeNull();
    });

    it ("it should not valid since both groups are invalid", () => {
        const orGroup = ValidationBuilder.or();
        orGroup.add(
            ValidationBuilder.and(ValidatorMockFactory.invalid(), ValidatorMockFactory.valid()),
            ValidationBuilder.and(ValidatorMockFactory.invalid(), ValidatorMockFactory.valid()),
        );
        expect(orGroup.validate(uploadFile)).not.toBeNull();
    });

    it ("should contain error message", () => {
    });
});
