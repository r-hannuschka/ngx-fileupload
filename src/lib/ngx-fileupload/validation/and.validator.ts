import { GroupedValidator } from "./grouped.validator";

export class AndValidator extends GroupedValidator {

    public validate(file: File) {
        return this.validators.every((validator) => validator.validate(file));
    }
}
