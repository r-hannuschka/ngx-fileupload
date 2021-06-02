import { NgxFileUploadResponse, NgxFileUploadState, NgxFileUploadValidationErrors, NgxFileUploadRequestData } from "@ngx-file-upload/core";

const file = new File(["ngx file upload unit tests"], "upload-file.txt", {type: "plain/text"});

export class NgxFileUploadModel implements NgxFileUploadRequestData {

    public constructor() {
        this.raw = file;
        this.name = file.name;
        this.type = file.type;
        this.size = file.size;
    }

    // @TODO check is duplicate of validationErrors
    validation: NgxFileUploadValidationErrors | null = null;

    isInvalid = false;

    raw: File;

    size = 0;

    name = "";

    type = "plain/text";

    response: NgxFileUploadResponse | null = null;

    isPending = false;

    state: NgxFileUploadState = NgxFileUploadState.IDLE;

    uploaded = 0;

    validationErrors: NgxFileUploadValidationErrors | null = null;

    progress = 0;

    isUploadAble = true;

    hasError = false;
}
