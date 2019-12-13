import { ValidationErrors } from "../../api";
import { GroupedValidator } from "./grouped.validator";

export class OrValidator extends GroupedValidator {

    public validate(file: File): ValidationErrors | null {

        let validationResult: ValidationErrors | null = {};

        for (const validator of this.validators) {
            const result = this.execValidator(validator, file);

            if (result === null) {
                validationResult = null;
                break;
            }

            Object.assign(validationResult, result);
        }

        return validationResult;
    }
}
