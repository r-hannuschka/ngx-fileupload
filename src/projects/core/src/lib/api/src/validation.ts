export interface NgxFileUploadValidationErrors {
    [key: string]: any;
}

export type NgxFileUploadValidationFn = (file: File) => NgxFileUploadValidationErrors | null;

export interface NgxFileUploadValidator {
    validate(file: File): NgxFileUploadValidationErrors | null;
}
