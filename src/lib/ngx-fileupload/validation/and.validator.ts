import { GroupedValidator } from "./grouped.validator";
import { ValidationErrors } from "./validation";

export class AndValidator extends GroupedValidator {

    public validate(file: File): ValidationErrors | null {

        const validationResult: ValidationErrors = {};
        let hasErrors = false;

        for (const validator of this.validators) {
            const result = validator.validate(file);
            if (result !== null) {
                Object.assign(validationResult, result);
                hasErrors = true;
            }
        }

        return hasErrors ? validationResult : null;
    }
}
