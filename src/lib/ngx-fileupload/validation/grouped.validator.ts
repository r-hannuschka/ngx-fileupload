import { Validator } from "./validation";

export abstract class GroupedValidator implements Validator {

    protected validators: Validator[] = [];

    public constructor(validators?: Validator[]) {
        if (validators !== undefined) {
            this.validators = validators;
        }
    }

    public abstract validate(file: File): any;

    public add(...validator: Validator[]) {
        this.validators = this.validators.concat(validator);
    }

    public clean() {
        this.validators = [];
    }
}
