import { simulateDrop } from "../../utils/drag-event";
import { by, browser, logging } from "protractor";
import { spawn, ChildProcess } from "child_process";
import { writeFileSync } from "fs";
import { NgxFileuploadPO } from "../support/ngx-fileupload.po";
import { Dashboard } from "../support/dashboard.po";

describe("Ngx Fileupload Default View", () => {

    let server: ChildProcess;
    let ngxFileUpload: NgxFileuploadPO;
    let dashboard: Dashboard;

    function slowDownUpload() {
        server.send({
            timeout: 1000
        });
    }

    beforeAll(async () => {
        // start very simple upload server which only logs
        server = spawn("node", ["./server/upload-server.js"], {stdio: [
            "pipe",
            "pipe",
            "pipe",
            "ipc"
        ]});

        ngxFileUpload = new NgxFileuploadPO();
        dashboard     = new Dashboard();
        await dashboard.navigateTo();

        ngxFileUpload.initialize();
    });

    describe("initialize app", () => {
        it("expect buttons to be disabled", async () => {
            expect(await ngxFileUpload.getUploadButton().isEnabled()).toBeFalsy();
            expect(await ngxFileUpload.getCancelButton().isEnabled()).toBeFalsy();
            expect(await ngxFileUpload.getCleanButton().isEnabled()).toBeFalsy();
        });

        it("expect upload informations to be shown", async () => {
            expect(await ngxFileUpload.getFileBrowser().getText()).toEqual("Drag/Drop files here or click");
        });
    });

    describe("cancel action should remove all uploads", () => {

        /** add 2 uploads the second one should be invalid */
        beforeAll(async () => {
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.txt");
        });

        it("should remove all uploads at once", async () => {
            expect(ngxFileUpload.getUploadItems().count()).toBe(2);
            await dashboard.cancelAll();
            expect(ngxFileUpload.getUploadItems().count()).toBe(0);
        });
    });

    describe("upload all action, should start all uploads at once", () => {

        /** clear log file first to be sure all is working */
        beforeAll(() => {
            writeFileSync("./server/upload.log", "", { encoding: "utf8", flag: "w"});
        });

        it("should upload all files to server at once", async () => {
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file2.zip");

            await dashboard.uploadAll();

            const uploadingItems = await ngxFileUpload.getUploadItems()
                .all(by.css(".upload-item--state i"))
                .map<string>(el => el.getAttribute("class"));

            expect(uploadingItems).toEqual([
                "ngx-fileupload-icon--completed success",
                "ngx-fileupload-icon--completed success"
            ]);
        });

        afterAll(async () => {
            await dashboard.cancelAll();
        });
    });

    describe("testing single fileupload", () => {

        beforeEach(async () => {
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
        });

        it("should enable all buttons in upload toolbar", async () => {
            expect(await ngxFileUpload.getUploadButton().isEnabled()).toBeTruthy();
            expect(await ngxFileUpload.getCancelButton().isEnabled()).toBeTruthy();
            expect(await ngxFileUpload.getCleanButton().isEnabled()).toBeTruthy();
        });

        it("should added ui", async () => {
            const items = ngxFileUpload.getUploadItems();
            const icons = items.first().all(by.css(".upload-item--body i"));
            const buttons = items.first().all(by.css(".upload-item--body button"));

            expect(await items.count()).toBe(1);
            expect(await icons.get(0).getAttribute("class")).toBe("ngx-fileupload-icon--idle");
            expect(await icons.get(1).getAttribute("class")).toBe("ngx-fileupload-icon--upload");
            expect(await icons.get(2).getAttribute("class")).toBe("ngx-fileupload-icon--cancel");

            // action buttons
            expect(await buttons.count()).toBe(2);
            expect(await buttons.map<string>(button => button.getAttribute("class")))
                .toEqual(["item-action--upload", "item-action--cancel"]);

            expect(await buttons.map<boolean>(button => button.isEnabled())).toEqual([true, true]);
        });

        it("should upload one item, and remove it", async () => {

            // slow down upload
            slowDownUpload();

            const item = ngxFileUpload.getUploadItems().first();
            const uploadAction = item.element(by.css(".upload-item--body .item-action--upload"));
            const cancelAction = item.element(by.css(".upload-item--body .item-action--cancel"));

            // dont wait for angular, click will trigger request
            // which we will wait for
            await browser.waitForAngularEnabled(false);
            await uploadAction.click();
            expect(await uploadAction.isEnabled()).toBeFalsy();
            expect(await cancelAction.isEnabled()).toBeTruthy();

            // wait for request has been completed
            await browser.waitForAngularEnabled(true);

            // file has been uploaded now should not be cancelable anymore
            expect(await cancelAction.isEnabled()).toBeFalsy();

            // uploaded with success
            const message = await item.element(by.css(".upload-item--footer")).getText();
            expect(message).toBe("Hoooray File: upload-file.zip uploaded to /dev/null");

            // now remove upload
            const removeAction = item.element(by.css("button.action-remove"));
            await removeAction.click();
            expect(await ngxFileUpload.getUploadItems().count()).toBe(0);
        });

        it("should upload item, but response with error", async () => {

            /** tell our server what to response */
            server.send({
                response: {
                    state: 401,
                    body: "forbidden"
                },
                timeout: 0
            });

            const uploadItem   = ngxFileUpload.getUploadItems().get(0);
            const errorIcon    = uploadItem.element(by.css(".ngx-fileupload-icon--completed.error"));
            const retryAction  = uploadItem.element(by.css(".item-action--reload"));
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));

            await dashboard.uploadAll();

            expect(await uploadAction.isPresent()).toBeFalsy();
            expect(await retryAction.isPresent()).toBeTruthy();
            expect(await retryAction.isDisplayed()).toBeTruthy();
            expect(await errorIcon.isDisplayed()).toBeTruthy();
        });

        afterEach(async () => {
            await dashboard.cancelAll();
        });
    });

    describe("testing queue", () => {

        /** clear log file first to be sure all is working */
        beforeAll(async () => {
            writeFileSync("./server/upload.log", "", { encoding: "utf8", flag: "w"});
        });

        it("should have added 10 files to list", async () => {
            for (let i = 0; i < 10; i++) {
                await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
            }
            expect(await ngxFileUpload.getUploadItems().count()).toBe(10);
        });

        it("should only upload 3 files at once and get 7 queued", async () => {
            server.send({
                response: null,
                // slow down server response for 1 second, otherwise it is too fast
                timeout: 1000
            });

            /** dont wait for angular since we dont want to know a upload process has been finished */
            await browser.waitForAngularEnabled(false);
            await dashboard.uploadAll();
            await browser.sleep(500);

            const items = ngxFileUpload.getUploadItems()
                .all(by.css(`.upload-item--state`));

            expect(await items.all(by.css("i.ngx-fileupload-icon--progress")).count()).toBe(3);
            expect(await items.all(by.css("i.ngx-fileupload-icon--pending")).count()).toBe(7);

            await dashboard.cancelAll();
            await browser.waitForAngularEnabled(true);
        });
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        let logs = await browser.manage().logs().get(logging.Type.BROWSER);

        /** we expect an error in browser with state of 401 so we filter this out */
        const error = "responded with a status of 401 (Unauthorized)";
        logs = logs.filter((entry: logging.Entry) => !entry.message.endsWith(error));

        expect(logs)
            .not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
    });

    afterAll(() => {
        server.kill("SIGINT");
    });
});
