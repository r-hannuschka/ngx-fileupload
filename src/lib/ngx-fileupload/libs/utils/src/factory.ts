import { InjectionToken, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UploadModel } from "../../../data/upload.model";
import { UploadRequest, UploadOptions } from "../../upload/src/upload.request";
import { ValidationFn, Validator } from "../../validation";

export interface NgxFileUploadFactory {
    create: (
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
    public create( file: File, options: UploadOptions, validator: ValidationFn | Validator = null): UploadRequest {
        const model  = new UploadModel(file);
        const upload = new UploadRequest(this.httpClient, model, options);

        if (validator) {
            upload.validate(validator);
        }
        return upload;
    }
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>("Ngx Fileupload Factory", {
    providedIn: "root",
    factory: () => new Factory(inject(HttpClient))
});
