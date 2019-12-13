import { Validator, ValidationErrors, ValidationFn } from "@ngx-file-upload/core";

class InvalidValidation implements Validator {
    validate(): ValidationErrors | null {
        return {
            invalid: "this is an invalid file"
        };
    }
}

class ValidValidation implements Validator {
    validate(): ValidationErrors | null {
        return null;
    }
}

class DynamicNameValidation implements Validator {

    public constructor(private name: string) {}

    validate(file: File): ValidationErrors | null {
        if (file.name !== this.name) {
            return {
                dynamicNameValidation: `invalid name: ${file.name}`
            };
        }
        return null;
    }
}

class InvalidFileValidator implements Validator {

    validate(): ValidationErrors | null {
        return {
            invalidFile: "invalid file"
        };
    }
}

class InvalidFileSizeValidator implements Validator {

    validate(): ValidationErrors | null {
        return {
            invalidFileSize: "file should be at least 1 Petabyte! Bigger is better!"
        };
    }
}

export class ValidatorMockFactory {

    public static invalid(): Validator {
        return new InvalidValidation();
    }

    public static valid(): Validator {
        return new ValidValidation();
    }

    public static byName(name: string): Validator {
        return new DynamicNameValidation(name);
    }

    public static invalidFile(): Validator {
        return new InvalidFileValidator();
    }

    public static invalidFileSize(): Validator {
        return new InvalidFileSizeValidator();
    }

    public static validValidationFn(): ValidationFn {
        return () => {
            return null;
        };
    }

    public static invalidValidationFn(): ValidationFn {
        return () => {
            return {
                invalidValidationFn: "invalid validation function called"
            };
        };
    }
}
