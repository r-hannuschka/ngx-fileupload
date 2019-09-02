import { Validator } from "lib/ngx-fileupload/validation/validation";

class InvalidValidation implements Validator {
    validate(file: File) {
        return false;
    }
}

class ValidValidation implements Validator {
    validate(file: File) {
        return true;
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
