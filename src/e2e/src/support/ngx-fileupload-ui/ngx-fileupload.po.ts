import { by, element, ElementArrayFinder } from "protractor";

export class NgxFileuploadPO {

    public get ngxFileUpload() {
        return element(by.tagName("ngx-fileupload"));
    }

    public getFileBrowser() {
        return this.ngxFileUpload.element(by.css(".fileupload"));
    }

    public getUploadList() {
        return this.ngxFileUpload.element(by.css(".file-upload--list"));
    }

    public getUploadItems(): ElementArrayFinder {
        return this.ngxFileUpload.all(by.tagName("ngx-fileupload-item"));
    }

    public getUploadActionsFromItem(): ElementArrayFinder {
        return this.ngxFileUpload.all(by.css(".item-action--cancel"));
    }
}
