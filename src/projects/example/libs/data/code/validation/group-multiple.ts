export * from "./is-image";

export const validationGroupMultiple = `
import { Component, OnInit } from "@angular/core";
import { isImage, isZipFile, MaxUploadSizeValidator } from "@ngx-fileupload-example/utils/validators";
import { NgxFileUploadValidationBuilder, NgxFileUploadGroupedvalidator } from "@ngx-file-upload/core";

@Component({
    selector: "app-validation--group-multiple",
    templateUrl: "group-multiple.component.html"
})
export class GroupMultipleComponent implements OnInit {

    public validator: NgxFileUploadGroupedvalidator;

    public ngOnInit() {
        const zipOrImage = NgxFileUploadValidationBuilder.or(isImage, isZipFile);
        const maxSize    = new MaxUploadSizeValidator(512 * 1024);

        /** bring all together */
        this.validator = NgxFileUploadValidationBuilder.and(zipOrImage, maxSize);
    }
}`;
