
import { Component, Input, TemplateRef, EventEmitter, Output } from "@angular/core";
import { UploadModel, FileUpload } from "lib/public-api";

export interface UploadContext {
    data: any;
    ctrl: any;
}

/**
 * view for upload
 */
@Component({
    template: "<div>ngx file upload item</div>",
    selector: "ngx-fileupload-item"
 })
export class NgxFileUploadItemMockComponent {

    /**
     * item template which should used to render upload data
     */
    public itemTpl: TemplateRef<UploadContext>;

    private fileUpload: FileUpload;

    /**
     * upload state has been changed
     */
    @Output()
    public changed: EventEmitter<UploadModel> = new EventEmitter();

    /**
     * template context which is bound to rendered template
     */
    public context: UploadContext;

    /**
     * sets upload we want to bind with current view
     */
    @Input()
    public set upload(fileUpload: FileUpload) {
        this.fileUpload = fileUpload;
    }

    public get upload(): FileUpload {
        return this.fileUpload;
    }

    @Input()
    public set template(tpl: TemplateRef<any>) {
        this.itemTpl = tpl;
    }

    public get template(): TemplateRef<any> {
        return this.itemTpl;
    }
}
