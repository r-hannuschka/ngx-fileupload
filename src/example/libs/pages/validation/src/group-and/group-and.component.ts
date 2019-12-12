import { Component, OnInit } from "@angular/core";
import { isImage, MaxUploadSizeValidator } from "@ngx-fileupload-example/utils/validators";
import { ValidationBuilder, GroupedValidator } from "projects/ngx-fileupload/public-api";
import * as ExampleCode from "@ngx-fileupload-example/data/code/validation/group-and";
import * as Validators from "@ngx-fileupload-example/data/code/utils/validators";

@Component({
    selector: "app-validation--group-and",
    templateUrl: "group-and.component.html"
})
export class GroupAndComponent implements OnInit {

    public validator: GroupedValidator;

    public exampleCode = ExampleCode;

    public codeValidator = Validators;

    public ngOnInit() {

        /** set max file upload size to 512kb */
        const maxUploadSize: number = 512 * 1024;

        this.validator = ValidationBuilder.and(
            isImage, new MaxUploadSizeValidator(maxUploadSize)
        );
    }
}
