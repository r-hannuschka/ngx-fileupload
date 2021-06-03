import { by, element, ElementArrayFinder, browser, ElementFinder } from "protractor";

export class UploadToolbarPO {

    public get toolbar(): ElementFinder {
        return element(by.tagName("ngx-file-upload-ui--toolbar"));
    }

    public get removeButton(): ElementFinder {
        return this.toolbar.element(by.css(".remove-all"));
    }

    public get uploadButton(): ElementFinder {
        return this.toolbar.element(by.css(".upload-all"));
    }

    public get clearButton(): ElementFinder {
        return this.toolbar.element(by.css(".clean"));
    }

    public get infoBar(): ElementFinder {
        return this.toolbar.element(by.css(".info"));
    }

    public get uploadStates(): ElementArrayFinder {
        return this.infoBar.all(by.css("ul li"));
    }

    public get actionButtons(): ElementArrayFinder {
        return this.toolbar.all(by.css(".actions button"));
    }

    async uploadAll() {
        /** scroll to upload button to avoid element could not be clicked */
        const location = await this.uploadButton.getLocation();
        await browser.executeScript(`scrollTo(${location.y}, ${location.x})`);
        return this.uploadButton.click();
    }

    async removeAll() {
        /** scroll to upload button to avoid element could not be clicked */
        const location = await this.removeButton.getLocation();
        await browser.executeScript(`scrollTo(${location.y}, ${location.x})`);
        return this.removeButton.click();
    }

    async clearAll() {
        /** scroll to upload button to avoid element could not be clicked */
        const location = await this.clearButton.getLocation();
        await browser.executeScript(`scrollTo(${location.y}, ${location.x})`);
        return this.clearButton.click();
    }
}
