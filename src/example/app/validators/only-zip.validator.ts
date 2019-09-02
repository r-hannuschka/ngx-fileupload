import { Validator } from "lib/ngx-fileupload/validation/validation";

export class OnlyZipValidator implements Validator {

    public validate(file: File) {

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
