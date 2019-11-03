import { GroupedValidator } from "./grouped.validator";
import { AndValidator } from "./and.validator";
import { OrValidator } from "./or.validator";
import { Validator, ValidationFn } from "./api";

export class ValidationBuilder {

    public static and(...validators: Array<Validator|ValidationFn>): GroupedValidator {
        return new AndValidator(validators);
    }

    public static or(...validators: Array<Validator|ValidationFn>): GroupedValidator {
        return new OrValidator(validators);
    }
}
