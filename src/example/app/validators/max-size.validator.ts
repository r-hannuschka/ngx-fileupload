import { Validator, ValidationErrors } from "lib/public-api";

export class MaxUploadSizeValidator implements Validator {

    public validate(file: File): ValidationErrors | null {
        const valid = (file.size / (1024 * 1024)) < 1;
        return !valid ? { maxFileSizeValidator: "max file size 1MByte" } : null;
    }
}
