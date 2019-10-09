export const HTML = `
<!--
    pass validator directly into standard ngx-fileupload view
    internally validator will directed to ngx fileupload directive
-->
<ngx-fileupload [url]="'http://somewhere/upload'" [validator]="validator"></ngx-fileupload>
`;

export const TYPESCRIPT = `
import { Component } from "@angular/core";
import { ValidationFn } from "@r-hannuschka/ngx-fileupload";
import { isImage } from "@ngx-fileupload-example/utils/validators";

@Component({
    selector: "app-validation--base",
    templateUrl: "base.component.html"
})
export class BaseComponent {
    public validator: ValidationFn = isImage;
}
`;
