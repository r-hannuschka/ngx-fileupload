
import { Validators } from "./validator.factory";
import { ValidationGroup } from "lib/ngx-fileupload/validation/validation.group";
import { GroupedValidator } from "lib/ngx-fileupload/validation/grouped.validator";

describe("GroupedValidation", () => {

    const uploadFile = new File(["upload testing"], "upload.txt", { type: "text/plain"});
    let group: GroupedValidator;

    beforeAll(() => {
        group = ValidationGroup.and();
    });

    beforeEach(() => {
        group.clean();
    });

    it ("it should validate with multiple groups", () => {
        group.add(
            ValidationGroup.or([
                Validators.invalid(),
                Validators.valid()
            ]),
            Validators.valid()
        );
        expect(group.validate(uploadFile)).toBeTruthy();
    });
});
