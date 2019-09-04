import { ValidationErrors } from "lib/ngx-fileupload/validation/validation";

export function isImage(file: File): ValidationErrors {

    /** super simple checking */
    const valid = /\.(jpg|jpeg|gif|png)$/.test(file.name);

    return !valid
        ? { isImage: "not a valid image file" }
        : null;
}
