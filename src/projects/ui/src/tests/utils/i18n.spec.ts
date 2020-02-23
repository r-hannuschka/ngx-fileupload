import { NgxFileUploadUiI18nProvider, NgxFileUploadUiI18nKey } from "../../lib/i18n";

describe("ngx-fileupload/libs/upload/upload-control", () => {

    it("should have no labels", () => {
        const i18nProvider = new NgxFileUploadUiI18nProvider(void 0);
        expect(i18nProvider.getI18n(NgxFileUploadUiI18nKey.Common)).toBeUndefined();
    });

    it("should have no labels", () => {
        const i18nProvider = new NgxFileUploadUiI18nProvider({
            common: {SELECT_FILES: "select file"}
        });
        expect(i18nProvider.getI18n(NgxFileUploadUiI18nKey.Common)).toEqual({SELECT_FILES: "select file"});
    });
});
