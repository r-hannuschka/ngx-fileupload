import { Component, OnInit } from "@angular/core";
import { isImage, isZipFile, MaxUploadSizeValidator } from "projects/example/libs/utils/validators";
import { NgxFileUploadValidationBuilder, NgxFileUploadGroupedvalidator } from "@ngx-file-upload/core";
import * as ExampleCode from "projects/example/libs/data/code/validation/group-multiple";
import * as Validators from "projects/example/libs/data/code/utils/validators";

@Component({
    selector: "app-validation--group-multiple",
    templateUrl: "group-multiple.component.html"
})
export class GroupMultipleComponent implements OnInit {
 
    public validator: NgxFileUploadGroupedvalidator | undefined;

    public exampleCode = ExampleCode;

    public codeValidator = Validators;

    public ngOnInit() {
        const zipOrImage = NgxFileUploadValidationBuilder.or(isImage, isZipFile);
        const maxSize    = new MaxUploadSizeValidator(512 * 1024);

        /** bring all together with and */
        this.validator = NgxFileUploadValidationBuilder.and(zipOrImage, maxSize);
    }
}
