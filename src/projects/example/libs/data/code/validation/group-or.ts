export * from "./is-image";

export const validationGroupOr = `
import { Component, OnInit } from "@angular/core";
import { isImage, isZipFile } from "@ngx-fileupload-example/utils/validators";
import { ValidationBuilder, GroupedValidator } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-validation--group-or",
    templateUrl: "group-or.component.html"
})
export class GroupOrComponent implements OnInit {

    public validator: GroupedValidator;

    public ngOnInit() {

        this.validator = ValidationBuilder.or(
            isImage, isZipFile
        );
    }
}`;
