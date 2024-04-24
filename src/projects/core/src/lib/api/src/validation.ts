import type { NgxFileuploadFormControl } from "./upload";

export interface NgxFileUploadValidationErrors {
    [key: string]: any;
}

export type NgxFileUploadValidationFn<TSource = File | NgxFileuploadFormControl> = (file: TSource) => NgxFileUploadValidationErrors | null;

export interface NgxFileUploadValidator<TSource = File | NgxFileuploadFormControl> {
    validate(file: TSource): NgxFileUploadValidationErrors | null;
}
