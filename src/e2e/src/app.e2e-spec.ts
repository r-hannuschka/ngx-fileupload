import { AppPage } from "./app.po";
import { simulateDrop } from "../utils/drag-event";
import { by, browser, logging } from "protractor";
import { spawn, ChildProcess } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { EOL } from "os";

describe("workspace-project App", () => {

    let page: AppPage;
    let server: ChildProcess;

    beforeAll(() => {
        // start very simple upload server which only logs
        server = spawn("node", ["./server/upload-server.js"], {stdio: [
            "pipe",
            "pipe",
            "pipe",
            "ipc"
        ]});
    });

    beforeEach(async () => {
        page = new AppPage();
    });

    describe("initialize app", () => {
        it("expect buttons to be disabled", async () => {
            await page.navigateTo();
            expect(await page.getUploadButton().isEnabled()).toBeFalsy();
            expect(await page.getCancelButton().isEnabled()).toBeFalsy();
            expect(await page.getCleanButton().isEnabled()).toBeFalsy();
        });

        it("expect upload informations to be shown", async () => {
            await page.navigateTo();
            expect(await page.getFileUploadField().getText()).toEqual("Drag/Drop files here or click");
        });
    });

    describe("cancel action should remove all uploads", () => {

        /** add 2 uploads the second one should be invalid */
        beforeAll(async () => {
            await simulateDrop(page.getFileUploadField(), "./upload-file.zip");
            await simulateDrop(page.getFileUploadField(), "./upload-file.txt");
        });

        it("should remove all uploads at once", async () => {
            const items        = page.getUploadItems();
            const cancelAction = page.getCancelButton();

            expect(items.count()).toBe(2);
            await cancelAction.click();
            expect(items.count()).toBe(0);
        });
    });

    describe("clean uploads which are invalid", () => {

        /** add 2 uploads the second one should be invalid */
        beforeAll(async () => {
            await simulateDrop(page.getFileUploadField(), "./upload-file.zip");
            await simulateDrop(page.getFileUploadField(), "./upload-file.txt");
        });

        it("should contain 2 uploads", () => {
            expect(page.getUploadItems().count()).toBe(2);
        });

        it("expect second upload is invalid and could not uploaded", () => {
            const invalidItem  = page.getUploadItems().get(1);
            const uploadAction = invalidItem.element(by.css(".item-action--upload"));
            const errorIcon    = invalidItem.element(by.css(".ngx-fileupload-icon--invalid"));
            const errorMessage = invalidItem.element(by.css(".upload-item--notification.error"));

            expect(uploadAction.isEnabled()).toBeFalsy();
            expect(errorIcon.isDisplayed()).toBeTruthy();
            expect(errorMessage.getText()).toBe("Only zip files are allowed");
        });

        /**
         * remove invalid uploads, test we only have one left and this one could
         * be uploaded
         */
        it("expect trigger clean button will remove invalid item", async () => {
            const uploadItems = page.getUploadItems();
            const cleanAction = page.getCleanButton();
            await cleanAction.click();

            expect(uploadItems.count()).toBe(1);
            expect(uploadItems.get(0).element(by.css(".item-action--upload")).isEnabled()).toBeTruthy();
        });

        afterAll(async () => {
            /** clean up all uploads */
            await page.getCancelButton().click();
        });
    });

    describe("upload all action, should start all uploads at once", () => {

        /** clear log file first to be sure all is working */
        beforeAll(() => {
            writeFileSync("./server/upload.log", "", { encoding: "utf8", flag: "w"});
        });

        /**
         * drop file so it can be uploaded
         */
        beforeAll(async () => {
            await simulateDrop(page.getFileUploadField(), "./upload-file.zip");
            await simulateDrop(page.getFileUploadField(), "./upload-file2.zip");
        });

        it("should upload all files to server at once", async (done) => {
            const uploadAction = page.getUploadButton();
            await uploadAction.click();

            /** wait one second */
            setTimeout(() => {
                const logFile = readFileSync("./server/upload.log", {encoding: "utf8"});
                const logs = logFile.split(EOL).slice(-3, -1);

                expect(logs.length).toBe(2);
                expect(logs[0]).toBe(`INFO - File uploaded: upload-file.zip`);
                expect(logs[1]).toBe(`INFO - File uploaded: upload-file2.zip`);
                done();
            }, 1000);

        });

        afterAll(async () => {
            await page.getCancelButton().click();
        });
    });

    describe("add file to upload", () => {

        beforeAll(async () => {
            await simulateDrop(page.getFileUploadField(), "./upload-file.zip");
        });

        it("should enable all buttons", async () => {
            expect(await page.getUploadButton().isEnabled()).toBeTruthy();
            expect(await page.getCancelButton().isEnabled()).toBeTruthy();
            expect(await page.getCleanButton().isEnabled()).toBeTruthy();

        });

        it("should display upload file in list", async () => {
            await page.getFileUploadList().isPresent();
            expect(await page.getFileUploadList().isDisplayed()).toBeTruthy();
            expect(await page.getUploadItems().count()).toBe(1);
        });

        it("upload should have icon queued", async () => {
            const uploadItem = page.getUploadItems().get(0);
            const queuedIcon = uploadItem.element(by.css(".ngx-fileupload-icon--queued"));

            expect(await queuedIcon.isDisplayed()).toBeTruthy();
        });

        it("should contain upload / cancel button", async () => {
            const uploadItem   = page.getUploadItems().get(0);
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));
            const stopAction   = uploadItem.element(by.css(".item-action--stop"));

            expect(await uploadAction.isDisplayed());
            expect(await stopAction.isDisplayed());
        });

        it("upload button should be enabled", async () => {
            const uploadItem   = page.getUploadItems().get(0);
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));

            expect(await uploadAction.isEnabled()).toBeTruthy();
        });

        /**
         * if no server is running / wrong url is passed it could not
         * reached and should display error
         */
        it("should fail since server not running, but show retry", async () => {

            /** tell our server what to response */
            server.send({
                state: 401,
                body: {
                    message: "forbidden"
                }
            });

            const uploadItem   = page.getUploadItems().get(0);
            const errorIcon    = uploadItem.element(by.css(".ngx-fileupload-icon--error"));
            const retryAction  = uploadItem.element(by.css(".item-action--retry"));
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));

            await uploadAction.click();

            expect(uploadAction.isPresent()).toBeFalsy();
            expect(retryAction.isPresent()).toBeTruthy();
            expect(retryAction.isDisplayed()).toBeTruthy();
            expect(errorIcon.isDisplayed()).toBeTruthy();
        });

        afterAll(async () => {
            /** clean up all uploads */
            await page.getCancelButton().click();
        });
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        let logs = await browser.manage().logs().get(logging.Type.BROWSER);
        const error = "responded with a status of 401 (Unauthorized)";

        // we expect an error with 401 filter this out
        logs = logs.filter((entry: logging.Entry) => !entry.message.endsWith(error));
        expect(logs)
            .not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
    });

    afterAll(() => {
        server.kill("SIGINT");
    });
});
