import { Component, OnInit } from "@angular/core";
import { isImage, isZipFile, MaxUploadSizeValidator } from "@ngx-fileupload-example/utils/validators";
import { ValidationBuilder, GroupedValidator } from "../ngx-fileupload/public-api";
import * as ExampleCode from "@ngx-fileupload-example/data/code/validation/group-multiple";
import * as Validators from "@ngx-fileupload-example/data/code/utils/validators";

@Component({
    selector: "app-validation--group-multiple",
    templateUrl: "group-multiple.component.html"
})
export class GroupMultipleComponent implements OnInit {

    public validator: GroupedValidator;

    public exampleCode = ExampleCode;

    public codeValidator = Validators;

    public ngOnInit() {
        const zipOrImage = ValidationBuilder.or(isImage, isZipFile);
        const maxSize    = new MaxUploadSizeValidator(512 * 1024);

        /** bring all together with and */
        this.validator = ValidationBuilder.and(zipOrImage, maxSize);
    }
}
