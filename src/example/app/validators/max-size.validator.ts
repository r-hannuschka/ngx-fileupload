import { NgxFileUploadValidator, ValidationResult } from "lib/public-api";

export class MaxUploadSizeValidator implements NgxFileUploadValidator {

    public validate(file: File): ValidationResult {
        const valid = (file.size / (1024 * 1024)) < 1;
        const error = !valid ? "Max file size 1MByte" : "";
        return { valid, error };
    }
}
