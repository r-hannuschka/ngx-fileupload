export const IMAGE_VALIDATOR = `
import { ValidationErrors } from "@r-hannuschka/ngx-fileupload";

/**
 * defines a validation function which should return
 * ValidationErrors if invalid or Null if valid
 */
export function isImage(file: File): ValidationErrors {

    /**
     * very easy check, would be better to check for mime type
     */
    const valid = /\.(jpg|jpeg|gif|png)$/i.test(file.name);

    return !valid
        ? { isImage: "not a valid image file" }
        : null;
}`;
