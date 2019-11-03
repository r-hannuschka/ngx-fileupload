import { InjectionToken, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UploadModel } from "../../../data/upload.model";
import { UploadRequest, UploadOptions } from "../../upload/src/upload.request";
import { ValidationFn, Validator } from "../../validation";
import { UploadState } from "../../../data/api";

export interface NgxFileUploadFactory {
    createUploadRequest: (
        file: File,
        options: UploadOptions,
        validators: Validator | ValidationFn
    ) => UploadRequest;
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

    /**
     * constructs new upload request
     */
    public createUploadRequest( file: File, options: UploadOptions, validator: ValidationFn | Validator = null): UploadRequest {
        const model = new UploadModel(file);
        let validationResult = null;

        if (validator) {
            validationResult = "validate" in validator ? validator.validate(file) : validator(file);
        }

        if (validationResult !== null) {
            model.state = UploadState.INVALID;
            model.validationErrors = validationResult;
        }
        return new UploadRequest(this.httpClient, model, options);
    }
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>("Ngx Fileupload Factory", {
    providedIn: "root",
    factory: () => new Factory(inject(HttpClient))
});
