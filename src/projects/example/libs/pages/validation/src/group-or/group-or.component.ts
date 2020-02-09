import { Component, OnInit } from "@angular/core";
import { isImage, isZipFile } from "projects/example/libs/utils/validators";
import { NgxFileUploadValidationBuilder, NgxFileUploadGroupedvalidator } from "@ngx-file-upload/core";
import * as ExampleCode from "projects/example/libs/data/code/validation/group-or";
import * as Validators from "projects/example/libs/data/code/utils/validators";

@Component({
    selector: "app-validation--group-or",
    templateUrl: "group-or.component.html"
})
export class GroupOrComponent implements OnInit {

    public validator: NgxFileUploadGroupedvalidator;

    public exampleCode = ExampleCode;

    public codeValidator = Validators;

    public ngOnInit() {

        this.validator = NgxFileUploadValidationBuilder.or(
            isImage, isZipFile
        );
    }
}
