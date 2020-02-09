import { NgxFileUploadValidationErrors } from "../../api";
import { NgxFileUploadGroupedvalidator } from "./grouped.validator";

export class NgxFileUploadOrValidator extends NgxFileUploadGroupedvalidator {

    public validate(file: File): NgxFileUploadValidationErrors | null {

        let validationResult: NgxFileUploadValidationErrors | null = {};

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
