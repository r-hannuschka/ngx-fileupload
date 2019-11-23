import { NgxFileUploadFactory, UploadOptions, ValidationFn, Validator } from "@r-hannuschka/ngx-fileupload";
import { UploadRequestMock } from "./upload-request.mock";
import { UploadModel } from "./upload-model";

export class NgxFileuploadFactoryMock implements NgxFileUploadFactory {

    createUploadRequest(file: File, options: UploadOptions, validator?: ValidationFn | Validator): UploadRequestMock;
    createUploadRequest(file: File[], options: UploadOptions, validator?: ValidationFn | Validator): UploadRequestMock[];
    createUploadRequest(
        file: File | File[],
        options: UploadOptions,
        validator?: ValidationFn | Validator
    ): UploadRequestMock | UploadRequestMock[] {
        const model = new UploadModel();
        return new UploadRequestMock(model);
    }
}
