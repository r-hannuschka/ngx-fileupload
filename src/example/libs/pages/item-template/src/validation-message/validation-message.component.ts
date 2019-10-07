import { Component, OnInit } from "@angular/core";
import { Upload, ValidationBuilder, GroupedValidator } from "@r-hannuschka/ngx-fileupload";
import { MaxUploadSizeValidator, OnlyZipValidator } from "@ngx-fileupload-example/utils/validators";

@Component({
    selector: "app-item-template--validation",
    templateUrl: "validation-message.component.html",
})

export class ValidationMessageComponent implements OnInit {

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
