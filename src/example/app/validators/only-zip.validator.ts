import { NgxFileUploadValidator, ValidationResult } from "lib/public-api";

export class OnlyZipValidator implements NgxFileUploadValidator {

    public validate(file: File): ValidationResult {

        console.dir(file);

        const valid = file.type === "application/x-zip-compressed";
        const error = !valid ? "Only zip files are allowed" : "";

        return { valid, error };
    }
}
