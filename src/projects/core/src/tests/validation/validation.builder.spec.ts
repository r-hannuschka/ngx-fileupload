import { NgxFileUploadValidationBuilder, NgxFileUploadOrValidator, NgxFileUploadAndValidator} from "@ngx-file-upload/dev/core/public-api";

describe("@ngx-file-upload/core/validation/builder", () => {

    it ("it should create OR Group", () => {
        const group = NgxFileUploadValidationBuilder.or();
        expect(group instanceof NgxFileUploadOrValidator).toBeTruthy();
    });

    it ("it should create AND Group", () => {
        const group = NgxFileUploadValidationBuilder.and();
        expect(group instanceof NgxFileUploadAndValidator).toBeTruthy();
    });
});
