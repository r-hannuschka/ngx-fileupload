import { NgxFileUploadGroupedvalidator } from "./grouped.validator";
import { NgxFileUploadAndValidator } from "./and.validator";
import { NgxFileUploadOrValidator } from "./or.validator";
import { NgxFileUploadValidation } from "../../api";

export class NgxFileUploadValidationBuilder {

    public static and(...validators: Array<NgxFileUploadValidation>): NgxFileUploadGroupedvalidator {
        return new NgxFileUploadAndValidator(validators);
    }

    public static or(...validators: Array<NgxFileUploadValidation>): NgxFileUploadGroupedvalidator {
        return new NgxFileUploadOrValidator(validators);
    }
}
