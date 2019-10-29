import { by, element, ElementArrayFinder, ElementFinder } from "protractor";

export class NgxFileuploadPO {

    private ngxFileUpload: ElementFinder;
    private toolbar: ElementFinder;

    public initialize() {
        this.ngxFileUpload = element(by.tagName("ngx-fileupload"));
        this.toolbar       = this.ngxFileUpload.element(by.css(".upload-toolbar"));
    }

    public getCancelButton() {
        return this.toolbar.element(by.css(".remove-all"));
    }

    public getUploadButton() {
        return this.toolbar.element(by.css(".upload-all"));
    }

    public getCleanButton() {
        return this.toolbar.element(by.css(".clean"));
    }

    public getFileBrowser() {
        return this.ngxFileUpload.element(by.css(".fileupload"));
    }

    public getUploadList() {
        return this.ngxFileUpload.element(by.css(".file-upload--list"));
    }

    public getUploadItems(): ElementArrayFinder {
        return element.all(by.tagName("ngx-fileupload-item"));
    }

    public getUploadActionsFromItem(): ElementArrayFinder {
        return element.all(by.css(".item-action--cancel"));
    }
}
