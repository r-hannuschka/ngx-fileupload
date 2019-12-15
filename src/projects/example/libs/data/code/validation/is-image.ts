export const HTML = `
<!--
    pass validator directly into standard ngx-fileupload view
    internally validator will directed to ngx fileupload directive

    <div ... [ngxFileUpload]="'URL'" [validator]="validator" ...>...</div>
-->
<ngx-fileupload [url]="'http://somewhere/upload'" [validator]="validator"></ngx-fileupload>
`;

export const TYPESCRIPT = `
import { Component } from "@angular/core";
import { ValidationFn } from "@ngx-file-upload/core";
import { isImage } from "@ngx-fileupload-example/utils/validators";

@Component({
    selector: "app-validation--is-image",
    templateUrl: "is-image.component.html"
})
export class BaseComponent {
    public validator: ValidationFn = isImage;
}
`;
