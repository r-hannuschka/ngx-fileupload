import { Component } from "@angular/core";
import { isImage } from "@ngx-fileupload-example/utils/validators";
import { ValidationFn } from "projects/ngx-fileupload/public-api";
import * as ExampleCode from "@ngx-fileupload-example/data/code/validation/is-image";
import * as Validators from "@ngx-fileupload-example/data/code/utils/validators";

@Component({
    selector: "app-validation--is-image",
    templateUrl: "is-image.component.html"
})
export class IsImageValidationComponent {

    public validator: ValidationFn = isImage;

    public exampleCode = ExampleCode;

    public codeValidator = Validators.IMAGE_VALIDATOR;
}
