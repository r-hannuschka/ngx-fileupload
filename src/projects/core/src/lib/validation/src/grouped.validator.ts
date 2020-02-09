import { NgxFileUploadValidationErrors, NgxFileUploadValidation, NgxFileUploadValidator } from "../../api";

export abstract class NgxFileUploadGroupedvalidator implements NgxFileUploadValidator {

    protected validators: Array<NgxFileUploadValidation>;

    public constructor(
       validators?: Array<NgxFileUploadValidation>
    ) {
        this.validators = Array.isArray(validators) ? validators : [];
    }

    public abstract validate(file: File): NgxFileUploadValidationErrors | null;

    /**
     * add validators
     */
    public add(...validators: Array<NgxFileUploadValidation>): void {
        this.validators = this.validators.concat(validators);
    }

    /**
     * clean up all validators
     */
    public clean() {
        this.validators = [];
    }

    /**
     * executes validator and returns validation result
     */
    protected execValidator(
        validator: NgxFileUploadValidation,
        file: File
    ): NgxFileUploadValidationErrors | null {
        /** we handle a validator class directly */
        if ("validate" in validator) {
            return validator.validate(file);
        }
        /** we handle a validation function */
        return validator(file);
    }
}
