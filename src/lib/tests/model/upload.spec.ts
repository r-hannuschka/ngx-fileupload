import { UploadModel, UploadState, UploadResponse } from "@r-hannuschka/ngx-fileupload";

describe("Model: Upload", () => {

    const FILE_CONTENT = "hello world";
    const FILE_NAME = "hello_world.txt";

    let file: File;
    let model: UploadModel;

    beforeEach(() => {
        file = new File([FILE_CONTENT], FILE_NAME, {type: "text/plain"});
        model = new UploadModel(file);
    });

    it("should return filename", () => {
        expect(model.fileName).toBe(FILE_NAME);
    });

    it("should return filesize", () => {
        expect(model.fileSize).toBe(FILE_CONTENT.length);
    });

    it("should return filetype", () => {
        expect(model.fileType).toBe("text/plain");
    });

    it("should set by default to queued", () => {
        expect(model.state).toBe(UploadState.IDLE);
    });

    it("should set new state", () => {
        model.state = UploadState.PROGRESS;
        expect(model.state).toBe(UploadState.PROGRESS);
    });

    it("should return uploaded size: 0 by default", () => {
        expect(model.uploaded).toBe(0);
    });

    it("should update uploaded size", () => {
        model.uploaded = 100;
        expect(model.uploaded).toBe(100);
    });


    it("should set a response", () => {
        const response: UploadResponse = {
            success: true,
            body: {
                message: "file was uploaded"
            },
            errors: null,
        };
        model.response = response;
        expect(model.response).toEqual(response);
    });

    it("should get progress from upload", () => {
        model.uploaded = model.fileSize / 2;
        expect(model.progress).toEqual(50);
    });

    it("should get progress max 100", () => {
        model.uploaded = model.fileSize * 1.5; // this will be 150%
        expect(model.progress).toEqual(100);
    });

    it("should return data as json", () => {
        const uploadData = {
            state     : UploadState.IDLE,
            uploaded  : 0,
            size      : file.size,
            name      : file.name,
            progress  : 0,
            response  : null,
            validation: {
                errors: null,
            }
        };
        expect(model.toJson()).toEqual(uploadData);
    });
});
