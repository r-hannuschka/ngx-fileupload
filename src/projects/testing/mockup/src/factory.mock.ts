import { NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadValidation } from "@ngx-file-upload/core";
import { UploadRequestMock } from "./upload-request.mock";
import { NgxFileUploadModel } from "./upload-model";

export class NgxFileuploadFactoryMock implements NgxFileUploadFactory {

    createUploadRequest(file: File, options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): UploadRequestMock;
    createUploadRequest(file: File[], options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): UploadRequestMock[];
    createUploadRequest(): UploadRequestMock | UploadRequestMock[] {
        const model = new NgxFileUploadModel();
        return new UploadRequestMock(model);
    }
}
