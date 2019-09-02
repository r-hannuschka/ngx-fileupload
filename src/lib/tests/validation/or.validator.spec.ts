import { OrValidator } from "lib/ngx-fileupload/validation/or.validator";
import { Validators } from "./validator.factory";

describe("GroupedValidation: Or", () => {

    const uploadFile = new File(["upload testing"], "upload.txt", { type: "text/plain"});
    let orValidationGroup: OrValidator;

    beforeAll(() => {
        orValidationGroup = new OrValidator();
    });

    beforeEach(() => {
        orValidationGroup.clean();
    });

    it ("it should validate", () => {
        orValidationGroup.add(Validators.invalid(), Validators.valid());
        expect(orValidationGroup.validate(uploadFile)).toBeTruthy();
    });

    it ("it should not validate", () => {
        orValidationGroup.add(Validators.invalid(), Validators.invalid());
        expect(orValidationGroup.validate(uploadFile)).toBeFalsy();
    });
});
