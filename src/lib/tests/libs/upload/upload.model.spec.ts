import { UploadModel, UploadState } from "@r-hannuschka/ngx-fileupload";

describe("ngx-fileupload/libs/upload/upload.model", () => {

    /**
     * very simple test this was the last which was missing
     */
    it ("should set model invalid", () => {
        const file = new File(["@r-hannuschka/ngx-fileupload"], "file.txt");
        const model = new UploadModel(file);

        model.state = UploadState.INVALID;
        expect(model.isInvalid).toBeTruthy();
    });
});
