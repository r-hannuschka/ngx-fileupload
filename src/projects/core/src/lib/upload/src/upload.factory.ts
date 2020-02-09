import { InjectionToken, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgxFileUploadOptions, NgxFileUploadState, NgxFileUploadRequest, NgxFileUploadValidation } from "../../api";
import { NgxFileUploadModel } from "./upload.model";
import { NgxFileUpload } from "./upload.request";

export interface NgxFileUploadFactory {
    createUploadRequest<T extends File | File[]>(
        file: T, options: NgxFileUploadOptions, validator?: NgxFileUploadValidation
    ): T extends File[] ? NgxFileUploadRequest[] : NgxFileUploadRequest;
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

    public createUploadRequest(file: File, options: NgxFileUploadOptions, validator: NgxFileUploadValidation): NgxFileUploadRequest;
    public createUploadRequest(file: File[], options: NgxFileUploadOptions, validator: NgxFileUploadValidation): NgxFileUploadRequest[];
    public createUploadRequest(file: File | File[], options: NgxFileUploadOptions, validator?: NgxFileUploadValidation) {

        if (Array.isArray(file)) {
            return file.map((source) => this.buildRequest(source, options, validator));
        } else {
            return this.buildRequest(file, options, validator);
        }
    }

    /**
     * build concrete upload request
     */
    private buildRequest(file: File, options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): NgxFileUploadRequest {
        const model = new NgxFileUploadModel(file);
        let validationResult = null;

        if (validator) {
            validationResult = "validate" in validator ? validator.validate(file) : validator(file);
        }

        if (validationResult !== null) {
            model.state = NgxFileUploadState.INVALID;
            model.validationErrors = validationResult;
        }

        return new NgxFileUpload(this.httpClient, model, options);
    }
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>("Ngx Fileupload Factory", {
    providedIn: "root",
    factory: () => new Factory(inject(HttpClient))
});
