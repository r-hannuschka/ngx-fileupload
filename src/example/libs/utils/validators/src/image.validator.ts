import { ValidationErrors } from "projects/ngx-fileupload/public-api";

export function isImage(file: File): ValidationErrors {

    /** super simple checking */
    const valid = /\.(jpg|jpeg|gif|png)$/i.test(file.name);

    return !valid
        ? { isImage: "not a valid image file" }
        : null;
}
