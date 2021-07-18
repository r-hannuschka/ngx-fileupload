import { ValidationErrors } from "@angular/forms";

/** 
 * @deprecated use ValidationErrors from @angular/forms instead
 */
export interface NgxFileUploadValidationErrors {
    [key: string]: any;
}

export type NgxFileUploadValidationFn = (file: File) => ValidationErrors | null;

export interface NgxFileUploadValidator {
    validate(file: File): ValidationErrors | null;
}
