import { OrValidator } from "lib/ngx-fileupload/libs/validation/src/or.validator";
import { ValidatorMockFactory } from "../mock/validator.factory";

describe("GroupedValidation: Or", () => {

    const uploadFile = new File([""], "or-validator-test.txt", { type: "text/plain"});
    let orValidationGroup: OrValidator;

    beforeAll(() => {
        orValidationGroup = new OrValidator();
    });

    beforeEach(() => {
        orValidationGroup.clean();
    });

    it ("it should validate", () => {
        orValidationGroup.add(ValidatorMockFactory.invalid(), ValidatorMockFactory.valid());
        expect(orValidationGroup.validate(uploadFile)).toBeNull();
    });

    it ("it should not validate", () => {
        orValidationGroup.add(ValidatorMockFactory.invalid(), ValidatorMockFactory.invalid());
        expect(orValidationGroup.validate(uploadFile)).not.toBeNull();
    });

    it ("should contain 2 errors", () => {
        orValidationGroup.add(
            ValidatorMockFactory.invalidFile(),
            ValidatorMockFactory.invalidFileSize()
        );

        const validationResult = orValidationGroup.validate(uploadFile);
        const validationKeys   = Object.keys(validationResult);

        expect(validationKeys.length).toBe(2);
        expect(validationKeys).toEqual(["invalidFile", "invalidFileSize"]);
    });
});
