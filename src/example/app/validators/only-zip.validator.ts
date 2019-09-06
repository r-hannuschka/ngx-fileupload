import { Validator, ValidationErrors } from "lib/ngx-fileupload/validation/validation";

export class OnlyZipValidator implements Validator {

    public validate(file: File): ValidationErrors | null {

        const validMime = [
            "application/zip",
            "application/octet-stream",
            "application/x-zip-compressed",
            "multipart/x-zip"
        ];

        let valid = validMime.some((type) => type === file.type);
        valid = valid && /\.zip$/.test(file.name);

        return !valid
            ? { zipValidator: "not a valid zip file" }
            : null;
    }
}
