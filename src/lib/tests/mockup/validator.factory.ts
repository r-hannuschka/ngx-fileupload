import { Validator, ValidationErrors, ValidationFn } from "@r-hannuschka/ngx-fileupload";

class InvalidValidation implements Validator {
    validate(file: File): ValidationErrors | null {
        return {
            invalid: {
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

class DynamicNameValidation implements Validator {

    public constructor(private name: string) {}

    validate(file: File): ValidationErrors | null {
        if (file.name !== this.name) {
            return {
                dynamicNameValidation: {
                    errors: [`invalid name: ${file.name}`]
                }
            };
        }
        return null;
    }
}

class InvalidFileValidator implements Validator {

    validate(file: File): ValidationErrors | null {
        return {
            invalidFile: {
                errors: ["invalid file"]
            }
        };
    }
}

class InvalidFileSizeValidator implements Validator {

    validate(file: File): ValidationErrors | null {
        return {
            invalidFileSize: {
                errors: ["file should be at least 1 Petabyte! Size is everything!"]
            }
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
        return (file: File) => {
            return null;
        };
    }

    public static invalidValidationFn(): ValidationFn {
        return (file: File) => {
            return {
                invalidValidationFn: "invalid validation function called"
            };
        };
    }
}
