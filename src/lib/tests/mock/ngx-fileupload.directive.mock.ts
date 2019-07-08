import { Directive, Output, EventEmitter, Input } from "@angular/core";
import { FileUpload } from "lib/public-api";

@Directive({
    selector: "[ngxFileUpload]",
    exportAs: "ngxFileUploadRef"
})
export class NgxFileUploadMockDirective {

    constructor() { }

    /**
     * upload has been added
     *
     * @example
     *
     * <div [ngxFileUpload]=""localhost/upload"" (add)="onUploadAdd($event)" ></div>
     */
    @Output()
    public add: EventEmitter<FileUpload[]> = new EventEmitter();

    /**
     * url which should be used as endpoint for the file upload
     * this field is mandatory
     *
     * @example
     * <div [ngxFileUpload]=""localhost/upload"" (add)="onUploadAdd($event)" ></div>
     */
    @Input("ngxFileUpload")
    public url = "";

    /**
     * if set to false upload post request body will use
     * plain file object in body
     */
    @Input()
    public useFormData = true;

    /**
     * form data field name with which form data will be send
     * by default this will be file
     */
    @Input()
    public formDataName = "file";

    public getUseFormData(): boolean {
        return this.useFormData;
    }

    public getUrl(): string {
        return this.url;
    }

    public getFormDataName(): string {
        return this.formDataName;
    }
}
