export * from "./is-image";

export const validationGroupOr = `
import { Component, OnInit } from "@angular/core";
import { isImage, isZipFile } from "@ngx-fileupload-example/utils/validators";
import { NgxFileUploadValidationBuilder, NgxFileUploadGroupedvalidator } from "@ngx-file-upload/core";

@Component({
    selector: "app-validation--group-or",
    templateUrl: "group-or.component.html"
})
export class GroupOrComponent implements OnInit {

    public validator: NgxFileUploadGroupedvalidator;

    public ngOnInit() {

        this.validator = NgxFileUploadValidationBuilder.or(
            isImage, isZipFile
        );
    }
}`;
