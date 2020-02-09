import { Component, OnInit } from "@angular/core";
import { isImage, MaxUploadSizeValidator } from "projects/example/libs/utils/validators";
import { NgxFileUploadValidationBuilder, NgxFileUploadGroupedvalidator } from "@ngx-file-upload/core";
import * as ExampleCode from "projects/example/libs/data/code/validation/group-and";
import * as Validators from "projects/example/libs/data/code/utils/validators";

@Component({
    selector: "app-validation--group-and",
    templateUrl: "group-and.component.html"
})
export class GroupAndComponent implements OnInit {

    public validator: NgxFileUploadGroupedvalidator;

    public exampleCode = ExampleCode;

    public codeValidator = Validators;

    public ngOnInit() {

        /** set max file upload size to 512kb */
        const maxUploadSize: number = 512 * 1024;

        this.validator = NgxFileUploadValidationBuilder.and(
            isImage, new MaxUploadSizeValidator(maxUploadSize)
        );
    }
}
