import { Validators } from "./validator.factory";
import { AndValidator } from "lib/ngx-fileupload/validation/and.validator";

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
        validationGroup.add(Validators.valid());
        validationGroup.add(Validators.valid());

        expect(validationGroup.validate(uploadFile)).toBeTruthy();
    });

    it ("it should not validate", () => {
        validationGroup.add(Validators.valid());
        validationGroup.add(Validators.invalid());

        expect(validationGroup.validate(uploadFile)).toBeFalsy();
    });
});
