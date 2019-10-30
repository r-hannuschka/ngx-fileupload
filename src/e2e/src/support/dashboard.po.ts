import { browser } from "protractor";
import { NgxFileuploadPO } from "../support/ngx-fileupload.po";

export class Dashboard {

    private ngxFileUpload: NgxFileuploadPO;

    async navigateTo() {
        await browser.get(browser.baseUrl);
        this.ngxFileUpload = new NgxFileuploadPO();
        this.ngxFileUpload.initialize();
    }

    async uploadAll() {
        /** scroll to upload button to avoid element could not be clicked */
        const location = await this.ngxFileUpload.getUploadButton().getLocation();
        await browser.executeScript(`scrollTo(${location.y}, ${location.x})`);
        return this.ngxFileUpload.getUploadButton().click();
    }

    async cancelAll() {
        /** scroll to upload button to avoid element could not be clicked */
        const location = await this.ngxFileUpload.getCancelButton().getLocation();
        await browser.executeScript(`scrollTo(${location.y}, ${location.x})`);
        return this.ngxFileUpload.getCancelButton().click();
    }
}
