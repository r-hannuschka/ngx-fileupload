import { UploadFile, UploadResponse, UploadState, ValidationErrors, UploadData } from "@r-hannuschka/ngx-fileupload";

const file = new File(["@r-hannuschka/ngx-fileupload unit tests"], "upload-file.txt", {type: "plain/text"});

export class UploadModelMockup implements UploadFile {

    file: File = file;

    fileSize: number = file.size;

    fileName = file.name;

    fileType = file.type;

    response: UploadResponse;

    isPending = false;

    isInvalid = false;

    requestId = Math.random().toString(32).substr(2);

    state = UploadState.IDLE;

    uploaded = 0;

    validationErrors: ValidationErrors | null = null;

    progress = 0;

    isUploadAble = true;

    hasError = false;
}
