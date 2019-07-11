import { InjectionToken } from "@angular/core";

/**
 * validation result from ngx fileupload validator
 */
export interface ValidationResult {
    /**
     * set to true if upload has been validated
     */
    valid: boolean;
    /**
     * if file has not validated, this error message will be shown
     */
    error: string;
}

/**
 * interface should implemented from custom validators for ngx-fileupload
 * provide under NGX_FILEUPLOAD_VALIDATOR token
 */
export interface NgxFileUploadValidator {

    /**
     * called to validate file
     */
    validate(file: File): ValidationResult;
}

/**
 * InjectionToken for ngx file upload validation classes
 */
export const NGX_FILEUPLOAD_VALIDATOR = new InjectionToken("Upload validation Service");
