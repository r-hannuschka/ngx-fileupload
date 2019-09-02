import { Validator } from "./validation";
import { GroupedValidator } from "./grouped.validator";
import { AndValidator } from "./and.validator";
import { OrValidator } from "./or.validator";

export class ValidationBuilder {

    public static and(validators: Validator[] = []): GroupedValidator {
        return new AndValidator(validators);
    }

    public static or(validators: Validator[] = []): GroupedValidator {
        return new OrValidator(validators);
    }
}
