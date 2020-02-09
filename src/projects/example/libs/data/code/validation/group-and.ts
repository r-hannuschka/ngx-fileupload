export * from "./is-image";

export const validationGroupAnd = `
import { Component, OnInit } from "@angular/core";
import { isImage, MaxUploadSizeValidator } from "@ngx-fileupload-example/utils/validators";
import { NgxFileUploadValidationBuilder, NgxFileUploadGroupedvalidator } from "@ngx-file-upload/core";

@Component({
    selector: "app-validation--validation-group",
    templateUrl: "validation-group.component.html"
})
export class ValidationGroupComponent implements OnInit {

    public validator: NgxFileUploadGroupedvalidator;

    public ngOnInit() {

        /** set max file upload size to 512kb */
        const maxUploadSize: number = 512 * 1024;

        this.validator = NgxFileUploadValidationBuilder.and(
            isImage, new MaxUploadSizeValidator(maxUploadSize)
        );
    }
}`;
