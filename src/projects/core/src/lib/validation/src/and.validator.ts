import { NgxFileUploadGroupedvalidator } from "./grouped.validator";
import { NgxFileUploadValidationErrors } from "../../api";

export class NgxFileUploadAndValidator extends NgxFileUploadGroupedvalidator {

    public validate(file: File): NgxFileUploadValidationErrors | null {

        const validationResult: NgxFileUploadValidationErrors = {};
        let hasErrors = false;

        for (const validator of this.validators) {
            const result = this.execValidator(validator, file);

            if (result !== null) {
                Object.assign(validationResult, result);
                hasErrors = true;
            }
        }
        return hasErrors ? validationResult : null;
    }
}
