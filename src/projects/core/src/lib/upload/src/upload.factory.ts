import { InjectionToken, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UploadOptions, UploadState, ValidationFn, Validator, UploadRequest } from "../../api";
import { UploadModel } from './upload.model';
import { Upload } from './upload.request';

export interface NgxFileUploadFactory {
    createUploadRequest<T extends File | File[]>(
        file: T, options: UploadOptions, validator?: Validator | ValidationFn
    ): T extends File[] ? UploadRequest[] : UploadRequest;
}

/**
 * Factory to create upload requests
 */
class Factory implements NgxFileUploadFactory {

    /**
     * construct upload factory
     */
    public constructor(
        private httpClient: HttpClient
    ) {}

    public createUploadRequest(file: File, options: UploadOptions, validator: ValidationFn | Validator): UploadRequest;
    public createUploadRequest(file: File[], options: UploadOptions, validator: ValidationFn | Validator): UploadRequest[];
    public createUploadRequest(file: File | File[], options: UploadOptions, validator?: ValidationFn | Validator) {

        if (Array.isArray(file)) {
            return file.map((source) => this.buildRequest(source, options, validator));
        } else {
            return this.buildRequest(file, options, validator);
        }
    }

    /**
     * build concrete upload request
     */
    private buildRequest(file: File, options: UploadOptions, validator?: ValidationFn | Validator): UploadRequest {
        const model = new UploadModel(file);
        let validationResult = null;

        if (validator) {
            validationResult = "validate" in validator ? validator.validate(file) : validator(file);
        }

        if (validationResult !== null) {
            model.state = UploadState.INVALID;
            model.validationErrors = validationResult;
        }

        return new Upload(this.httpClient, model, options);
    }
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>("Ngx Fileupload Factory", {
    providedIn: "root",
    factory: () => new Factory(inject(HttpClient))
});
