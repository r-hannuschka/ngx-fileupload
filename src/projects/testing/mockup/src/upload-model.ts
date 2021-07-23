import { NgxFileUploadResponse, NgxFileUploadState, NgxFileUploadValidationErrors } from "@ngx-file-upload/core";
import { INgxFileUploadFile, INgxFileUploadRequestModel, NgxFileUploadFile } from "@ngx-file-upload/dev/core/public-api";

const file = new File(["ngx file upload unit tests"], "upload-file.txt", {type: "plain/text"});

export class NgxFileUploadRequestModel implements INgxFileUploadRequestModel {

    files: INgxFileUploadFile[] = [new NgxFileUploadFile(file)];

    // @TODO check is duplicate of validationErrors
    validation: NgxFileUploadValidationErrors | null = null;

    isInvalid = false;

    size = 0;

    /** useless */
    name = [""];

    type = "plain/text";

    response: NgxFileUploadResponse | null = null;

    isPending = false;

    state: NgxFileUploadState = NgxFileUploadState.IDLE;

    uploaded = 0;

    validationErrors: NgxFileUploadValidationErrors | null = null;

    progress = 0;

    isUploadAble = true;

    hasError = false;

    toJson(): Omit<INgxFileUploadRequestModel, "progress"> {
        throw new Error("Method not implemented.");
    }
}
