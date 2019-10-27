import { ValidationBuilder } from "lib/ngx-fileupload/libs/validation/src/validation.builder";
import { OrValidator } from "lib/ngx-fileupload/libs/validation/src/or.validator";
import { AndValidator } from "lib/ngx-fileupload/libs/validation/src/and.validator";

describe("ValidationBuilder", () => {

    it ("it should create OR Group", () => {
        const group = ValidationBuilder.or();
        expect(group instanceof OrValidator).toBeTruthy();
    });

    it ("it should create AND Group", () => {
        const group = ValidationBuilder.and();
        expect(group instanceof AndValidator).toBeTruthy();
    });
});
