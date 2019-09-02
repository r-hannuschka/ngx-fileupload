import { Validator } from "lib/ngx-fileupload/validation/validation";

export class MaxUploadSizeValidator implements Validator {

    public validate(file: File) {
        const valid = (file.size / (1024 * 1024)) < 1;
        const error = !valid ? "Max file size 1MByte" : "";
        return { valid, error };
    }
}
