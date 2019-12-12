import { ValidationBuilder, OrValidator, AndValidator} from "projects/ngx-fileupload/public-api";

describe("ngx-fileupload/libs/validation/builder", () => {

    it ("it should create OR Group", () => {
        const group = ValidationBuilder.or();
        expect(group instanceof OrValidator).toBeTruthy();
    });

    it ("it should create AND Group", () => {
        const group = ValidationBuilder.and();
        expect(group instanceof AndValidator).toBeTruthy();
    });
});
