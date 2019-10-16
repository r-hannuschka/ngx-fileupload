import { ValidationBuilder } from "@lib/utils/src/validation/validation.builder";
import { OrValidator } from "@lib/utils/src/validation/or.validator";
import { AndValidator } from "@lib/utils/src/validation/and.validator";

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
