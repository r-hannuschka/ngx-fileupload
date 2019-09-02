import { Validator, ValidationErrors } from "lib/ngx-fileupload/validation/validation";

export class ImageValidator implements Validator {

    public validate(file: File): ValidationErrors | null {

        /** super simple checking */
        const valid = /\.(jpg|jpeg|gif|png)$/.test(file.name);

        return !valid
            ? { imageValidator: "not a valid image file" }
            : null;
    }
}
