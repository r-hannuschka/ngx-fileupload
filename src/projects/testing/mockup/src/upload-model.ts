import { UploadResponse, UploadState, ValidationErrors, UploadRequestData } from "@ngx-file-upload/core";

const file = new File(["ngx file upload unit tests"], "upload-file.txt", {type: "plain/text"});

export class UploadModel implements UploadRequestData {

    public constructor() {
        this.raw = file;
        this.name = file.name;
        this.type = file.type;
        this.size = file.size;
    }

    validation: ValidationErrors = null;

    isInvalid = false;

    raw: File;

    size = 0;

    name = "";

    type = "plain/text";

    response: UploadResponse = null;

    isPending = false;

    state: UploadState = UploadState.IDLE;

    uploaded = 0;

    validationErrors: ValidationErrors | null = null;

    progress = 0;

    isUploadAble = true;

    hasError = false;
}
