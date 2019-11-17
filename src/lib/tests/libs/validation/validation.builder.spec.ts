import { ValidationBuilder, OrValidator, AndValidator} from "@r-hannuschka/ngx-fileupload";

describe("ngx-fileupload/libs/validation", () => {
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
});
