import { NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadValidation } from "@ngx-file-upload/core";
import { UploadRequestMock } from "./upload-request.mock";
import { NgxFileUploadRequestModel } from "./upload-model";

export class NgxFileuploadFactoryMock implements NgxFileUploadFactory {

    createUploadRequests(file: File, options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): UploadRequestMock;
    createUploadRequests(file: File[], options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): UploadRequestMock[];
    createUploadRequests(): UploadRequestMock | UploadRequestMock[] {
        const model = new NgxFileUploadRequestModel();
        return new UploadRequestMock(model);
    }
}
