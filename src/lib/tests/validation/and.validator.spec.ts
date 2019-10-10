import { ValidatorMockFactory } from "../mock/validator.factory";
import { AndValidator } from "lib/ngx-fileupload/utils/validation/and.validator";

describe("GroupedValidation: And", () => {

    const uploadFile = new File(["upload testing"], "upload.txt", { type: "text/plain"});
    let validationGroup: AndValidator;

    beforeAll(() => {
        validationGroup = new AndValidator();
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
        const validationKeys   = Object.keys(validationResult);

        expect(validationKeys.length).toBe(1);
        expect(validationKeys).toEqual(["invalidFileSize"]);
    });

    it ("should contain multiple errors", () => {

        validationGroup.add(
            ValidatorMockFactory.invalid(),
            ValidatorMockFactory.invalidFileSize()
        );

        const validationResult = validationGroup.validate(uploadFile);
        const validationKeys   = Object.keys(validationResult);

        expect(validationKeys.length).toBe(2);
        expect(validationKeys).toEqual(["invalid", "invalidFileSize"]);
    });
});
