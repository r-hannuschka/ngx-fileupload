import { GroupedValidator } from "./grouped.validator";
import { Validator } from "./validation";

export class OrValidator extends GroupedValidator {

    /** if something not validate i want the fucking message */
    public validate(file: File) {
        return this.validators.some((validator: Validator) => validator.validate(file));
    }
}
