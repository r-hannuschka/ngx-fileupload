import { NgxFileUploadValidator, ValidationResult } from "lib/public-api";

export class OnlyZipValidator implements NgxFileUploadValidator {

    public validate(file: File): ValidationResult {

        const validMime = [
            "application/zip",
            "application/octet-stream",
            "application/x-zip-compressed",
            "multipart/x-zip"
        ];

        let valid = validMime.some((type) => type === file.type);
        valid = valid && /\.zip$/.test(file.name);

        const error = !valid ? "Only zip files are allowed" : "";

        return { valid, error };
    }
}
