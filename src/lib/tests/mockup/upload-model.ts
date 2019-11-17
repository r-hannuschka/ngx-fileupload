import { UploadResponse, UploadState, ValidationErrors, FileUpload } from "@r-hannuschka/ngx-fileupload";

const file = new File(["@r-hannuschka/ngx-fileupload unit tests"], "upload-file.txt", {type: "plain/text"});

export class UploadModel implements FileUpload {

    validation: ValidationErrors = null;

    isInvalid: boolean;

    file: File = file;

    size: number = file.size;

    name;

    type;

    response: UploadResponse;

    isPending = false;

    requestId = Math.random().toString(32).substr(2);

    state = UploadState.IDLE;

    uploaded = 0;

    validationErrors: ValidationErrors | null = null;

    progress = 0;

    isUploadAble = true;

    hasError = false;
}
