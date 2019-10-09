import { Component } from "@angular/core";
import { isImage } from "@ngx-fileupload-example/utils/validators";
import { ValidationFn } from "@r-hannuschka/ngx-fileupload";
import * as ExampleCode from "@ngx-fileupload-example/data/code/examples-validation/base";
import * as Validators from "@ngx-fileupload-example/data/code/utils/validators";

@Component({
    selector: "app-validation--base",
    templateUrl: "base.component.html"
})
export class BaseComponent {

    public validator: ValidationFn = isImage;

    public exampleCode = ExampleCode;

    public codeValidator = Validators.IMAGE_VALIDATOR;
}
