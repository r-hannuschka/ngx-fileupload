import { Validator, ValidationErrors } from "./validation";

export abstract class GroupedValidator implements Validator {

    public constructor(
        protected validators: Validator[] = []
    ) {}

    public abstract validate(file: File): ValidationErrors | null;

    public add(...validator: Validator[]) {
        this.validators = this.validators.concat(validator);
    }

    public clean() {
        this.validators = [];
    }
}
