import { Component, OnInit } from "@angular/core";
import { isImage, isZipFile } from "@ngx-fileupload-example/utils/validators";
import { ValidationBuilder, GroupedValidator } from "projects/ngx-fileupload/public-api";
import * as ExampleCode from "@ngx-fileupload-example/data/code/validation/group-or";
import * as Validators from "@ngx-fileupload-example/data/code/utils/validators";

@Component({
    selector: "app-validation--group-or",
    templateUrl: "group-or.component.html"
})
export class GroupOrComponent implements OnInit {

    public validator: GroupedValidator;

    public exampleCode = ExampleCode;

    public codeValidator = Validators;

    public ngOnInit() {

        this.validator = ValidationBuilder.or(
            isImage, isZipFile
        );
    }
}
