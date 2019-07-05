import { AppPage } from "./app.po";
import { browser, logging, by } from "protractor";
import { simulateDrop } from "../utils/drag-event";

describe("workspace-project App", () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    describe("initialize app", () => {
        it("expect buttons to be disabled", async () => {
            page.navigateTo();

            expect(page.getUploadButton().isEnabled()).toBeFalsy();
            expect(page.getCancelButton().isEnabled()).toBeFalsy();
            expect(page.getCleanButton().isEnabled()).toBeFalsy();
        });

        it("expect upload informations to be shown", async () => {
            page.navigateTo();
            expect(page.getFileUploadField().getText()).toEqual("Drag/Drop files here or click");
        });
    });

    describe("add file to upload", () => {

        beforeAll(async () => {
            await simulateDrop(page.getFileUploadField(), "./upload-file.zip");
        });

        it("should enable all buttons", () => {
            expect(page.getUploadButton().isEnabled()).toBeTruthy();
            expect(page.getCancelButton().isEnabled()).toBeTruthy();
            expect(page.getCleanButton().isEnabled()).toBeTruthy();

        });

        it("should display upload file in list", () => {
            expect(page.getFileUploadList().isPresent()).toBeTruthy();
            expect(page.getUploadItems().count()).toBe(1);
        });

        it("upload should have icon queued", () => {
            const uploadItem = page.getUploadItems().get(0);
            const queuedIcon = uploadItem.element(by.css(".ngx-fileupload-icon--queued"));
            expect(queuedIcon.isPresent()).toBeTruthy();
        });

        it("should contain upload / cancel button", () => {
            const uploadItem   = page.getUploadItems().get(0);
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));
            const stopAction   = uploadItem.element(by.css(".item-action--stop"));

            expect(uploadAction.isDisplayed());
            expect(stopAction.isDisplayed());
        });

        it("upload button should be enabled", () => {
            const uploadItem   = page.getUploadItems().get(0);
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));

            expect(uploadAction.isEnabled()).toBeTruthy();
        });

        it("should try upload item (connection failed)", () => {
            const uploadItem   = page.getUploadItems().get(0);

            const startIcon    = uploadItem.element(by.css(".ngx-fileupload-icon--start"));
            const errorIcon    = uploadItem.element(by.css(".ngx-fileupload-icon--error"));

            const uploadAction = uploadItem.element(by.css(".item-action--upload"));
            const retryAction  = uploadItem.element(by.css(".item-action--retry"));

            /**
             * dont wait for request to finish
             * so we can interact with the browser
             */
            browser.waitForAngularEnabled(false);

            uploadAction.click();
            expect(uploadAction.isEnabled()).toBeFalsy();
            expect(startIcon.isDisplayed()).toBeTruthy();

            /**
             * now wait for http request, if this one has
             * finished it should contain error icon and retry button
             */
            browser.waitForAngularEnabled(true);

            errorIcon.isPresent().then(() => {
                expect(errorIcon.isDisplayed()).toBeTruthy();
                expect(retryAction.isDisplayed()).toBeTruthy();
            });

            browser.manage().logs().get("browser").then((browserLog) => {
                expect(browserLog[0].message).toContain("ERR_CONNECTION_REFUSED");
            });
        });

        afterAll(() => {
            page.getCancelButton().click();
        });
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
        level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
