import { Validator, ValidationErrors } from "lib/ngx-fileupload/validation/validation";

class InvalidValidation implements Validator {
    validate(file: File): ValidationErrors | null {
        return {
            invalidFile: {
                errors: ["this is an invalid file"]
            }
        };
    }
}

class ValidValidation implements Validator {
    validate(file: File): ValidationErrors | null {
        return null;
    }
}

export class Validators {

    public static invalid(): Validator {
        return new InvalidValidation();
    }

    public static valid(): Validator {
        return new ValidValidation();
    }
}

/*
<div ngIf="upload.hasError">
    <ngfor let="error of upload.errors">
        - only zip files allowed
        - only image files allowed
        - max file size 1MByte
    </ngfor>
</div>
*/
