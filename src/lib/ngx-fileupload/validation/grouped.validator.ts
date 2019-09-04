import { Validator, ValidationErrors, ValidationFn } from "./validation";

export abstract class GroupedValidator implements Validator {

    protected validators: Array<Validator|ValidationFn>;

    public constructor(
       validators?: Array<ValidationFn|Validator>
    ) {
        this.validators = Array.isArray(validators) ? validators : [];
    }

    public abstract validate(file: File): ValidationErrors | null;

    /**
     * add validators
     */
    public add(...validators: Array<ValidationFn|Validator>): void {
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
    protected execValidator(validator: Validator | ValidationFn, file: File): ValidationErrors | null {
        /** we handle a validator class directly */
        if ("validate" in validator) {
            return validator.validate(file);
        }
        /** we handle a validation function */
        return validator(file);
    }
}
