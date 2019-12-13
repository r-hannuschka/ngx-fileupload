import { NgxFileUploadFactory, UploadOptions, ValidationFn, Validator } from "@ngx-file-upload/core";
import { UploadRequestMock } from "./upload-request.mock";
import { UploadModel } from "./upload-model";

export class NgxFileuploadFactoryMock implements NgxFileUploadFactory {

    createUploadRequest(file: File, options: UploadOptions, validator?: ValidationFn | Validator): UploadRequestMock;
    createUploadRequest(file: File[], options: UploadOptions, validator?: ValidationFn | Validator): UploadRequestMock[];
    createUploadRequest(): UploadRequestMock | UploadRequestMock[] {
        const model = new UploadModel();
        return new UploadRequestMock(model);
    }
}
