import { browser, by, element, ElementFinder } from "protractor";

export class AppPage {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    public getCancelButton() {
        return element(by.css("button.upload-action--cancel"));
    }

    public getUploadButton() {
        return element(by.css("button.upload-action--upload"));
    }

    public getCleanButton() {
        return element(by.css("button.upload-action--clean"));
    }

    public getFileUploadField() {
        return element(by.css("div.fileupload"));
    }

    public getFileUploadList() {
        return element(by.css("div.file-upload--list"));
    }

    public getUploadItems() {
        return element.all(by.css("ngx-fileupload-item"));
    }
}
