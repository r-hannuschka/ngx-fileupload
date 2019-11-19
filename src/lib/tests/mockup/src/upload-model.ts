import { UploadResponse, UploadState, ValidationErrors, FileUpload } from "@r-hannuschka/ngx-fileupload";

const file = new File(["@r-hannuschka/ngx-fileupload unit tests"], "upload-file.txt", {type: "plain/text"});

export class UploadModel implements FileUpload {

    public constructor() {
        this.file = file;
        this.name = file.name;
        this.type = file.type;
        this.size = file.size;
    }

    validation: ValidationErrors = null;

    isInvalid = false;

    file: File;

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
