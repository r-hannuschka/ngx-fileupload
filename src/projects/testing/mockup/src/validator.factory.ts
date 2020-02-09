import { NgxFileUploadValidator, NgxFileUploadValidationErrors, NgxFileUploadValidationFn } from "@ngx-file-upload/core";

class InvalidValidation implements NgxFileUploadValidator {
    validate(): NgxFileUploadValidationErrors | null {
        return {
            invalid: "this is an invalid file"
        };
    }
}

class ValidValidation implements NgxFileUploadValidator {
    validate(): NgxFileUploadValidationErrors | null {
        return null;
    }
}

class DynamicNameValidation implements NgxFileUploadValidator {

    public constructor(private name: string) {}

    validate(file: File): NgxFileUploadValidationErrors | null {
        if (file.name !== this.name) {
            return {
                dynamicNameValidation: `invalid name: ${file.name}`
            };
        }
        return null;
    }
}

class InvalidFileValidator implements NgxFileUploadValidator {

    validate(): NgxFileUploadValidationErrors | null {
        return {
            invalidFile: "invalid file"
        };
    }
}

class InvalidFileSizeValidator implements NgxFileUploadValidator {

    validate(): NgxFileUploadValidationErrors | null {
        return {
            invalidFileSize: "file should be at least 1 Petabyte! Bigger is better!"
        };
    }
}

export class ValidatorMockFactory {

    public static invalid(): NgxFileUploadValidator {
        return new InvalidValidation();
    }

    public static valid(): NgxFileUploadValidator {
        return new ValidValidation();
    }

    public static byName(name: string): NgxFileUploadValidator {
        return new DynamicNameValidation(name);
    }

    public static invalidFile(): NgxFileUploadValidator {
        return new InvalidFileValidator();
    }

    public static invalidFileSize(): NgxFileUploadValidator {
        return new InvalidFileSizeValidator();
    }

    public static validValidationFn(): NgxFileUploadValidationFn {
        return () => {
            return null;
        };
    }

    public static invalidValidationFn(): NgxFileUploadValidationFn {
        return () => {
            return {
                invalidValidationFn: "invalid validation function called"
            };
        };
    }
}
