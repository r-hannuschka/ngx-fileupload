import { ValidationErrors } from "@ngx-file-upload/core";

export function isImage(file: File): ValidationErrors {

    /** super simple checking */
    const valid = /\.(jpg|jpeg|gif|png)$/i.test(file.name);

    return !valid
        ? { isImage: "not a valid image file" }
        : null;
}
