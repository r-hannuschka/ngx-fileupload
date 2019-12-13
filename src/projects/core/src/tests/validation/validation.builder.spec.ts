import { ValidationBuilder, OrValidator, AndValidator} from "@ngx-file-upload/dev/core/public-api";

describe("@ngx-file-upload/core/validation/builder", () => {

    it ("it should create OR Group", () => {
        const group = ValidationBuilder.or();
        expect(group instanceof OrValidator).toBeTruthy();
    });

    it ("it should create AND Group", () => {
        const group = ValidationBuilder.and();
        expect(group instanceof AndValidator).toBeTruthy();
    });
});
