import { Component } from "@angular/core";
import { isImage } from "projects/example/libs/utils/validators";
import { ValidationFn } from "@ngx-file-upload/core";
import * as ExampleCode from "projects/example/libs/data/code/validation/is-image";
import * as Validators from "projects/example/libs/data/code/utils/validators";

@Component({
    selector: "app-validation--is-image",
    templateUrl: "is-image.component.html"
})
export class IsImageValidationComponent {

    public validator: ValidationFn = isImage;

    public exampleCode = ExampleCode;

    public codeValidator = Validators.IMAGE_VALIDATOR;
}
