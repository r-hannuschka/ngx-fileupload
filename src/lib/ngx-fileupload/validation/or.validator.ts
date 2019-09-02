import { GroupedValidator } from "./grouped.validator";
import { ValidationErrors } from "./validation";

export class OrValidator extends GroupedValidator {

    public validate(file: File): ValidationErrors | null {

        let validationResult: ValidationErrors | null = {};
        for (const validator of this.validators) {
            const result = validator.validate(file);

            /** if null at least one has validated and thats enough */
            if (result === null) {
                validationResult = null;
                break;
            }

            /** map all data to validation result */
            Object.assign(validationResult, result);
        }
        return validationResult;
    }
}
