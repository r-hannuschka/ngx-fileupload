import { Component, OnInit } from "@angular/core";
import { Upload, ValidationBuilder, GroupedValidator } from "@r-hannuschka/ngx-fileupload";
import { MaxUploadSizeValidator, OnlyZipValidator } from "@ngx-fileupload-example/utils/validators";

import * as ExampleCodeData from "@ngx-fileupload-example/data/code/examples-item-template/validation-message";
import * as uiUploadToolbarData from "@ngx-fileupload-example/data/code/ui/ui-upload-toolbar";

@Component({
    selector: "app-item-template--validation",
    templateUrl: "validation-message.component.html",
    styleUrls: ["./validation-message.component.scss"]
})
export class ValidationMessageComponent implements OnInit {

    public code = ExampleCodeData;

    public codeUiUploadToolbarData = uiUploadToolbarData;

    public uploads: Upload[] = [];

    public validation: GroupedValidator;

    public ngOnInit() {

        const sizeValidator = new MaxUploadSizeValidator();
        const zipValidator  = new OnlyZipValidator();

        this.validation = ValidationBuilder.and(
            sizeValidator,
            zipValidator
        );
    }

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public uploadCompleted(completed: Upload) {
        if (!completed.hasError()) {
            this.uploads = this.uploads.filter((upload) => completed !== upload);
        }
    }
}
