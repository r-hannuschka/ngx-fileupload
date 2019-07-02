import { InjectionToken } from '@angular/core';

export const NGX_FILEUPLOAD_VALIDATOR = new InjectionToken('Upload validation Service');

export interface ValidationResult {
    valid: boolean;
    error: string;
}

export interface NgxFileUploadValidator {
    validate(file: File): ValidationResult;
}
