import { ValidationErrors } from "../ngx-fileupload/public-api";

export function isZipFile(file: File): ValidationErrors | null {

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
