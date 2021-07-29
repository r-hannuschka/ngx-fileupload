import { INgxFileUploadRequestData, NgxFileUploadResponse, NgxFileUploadState, NgxFileUploadValidationErrors } from "@ngx-file-upload/core";
import { INgxFileUploadFile, INgxFileUploadRequestModel, NgxFileUploadFile } from "@ngx-file-upload/dev/core/public-api";

const file = new File(["ngx file upload unit tests"], "upload-file.txt", {type: "plain/text"});

export class NgxFileUploadRequestModel implements INgxFileUploadRequestModel {

    files: INgxFileUploadFile[] = [new NgxFileUploadFile(file)];

    validation: NgxFileUploadValidationErrors | null = null;

    isInvalid = false;

    size = 0;

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

    toJson(): INgxFileUploadRequestData {
        const jsonedObject: Record<string, unknown> = {};
        for (const x in this) {
            if (x === "toJson" || x === "constructor") {
                continue;
            }
            jsonedObject[x] = this[x];
        }
        return jsonedObject as unknown as INgxFileUploadRequestData;
    }
}
