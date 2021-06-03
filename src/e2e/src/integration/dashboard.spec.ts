import { simulateDrop } from "../utils/drag-event";
import { by, browser } from "protractor";
import { spawn, ChildProcess } from "child_process";
import { writeFileSync } from "fs";
import { NgxFileuploadPO } from "../support/ngx-fileupload-ui/ngx-fileupload.po";
import { Dashboard } from "../support/dashboard.po";
import { UploadToolbarPO } from "../support/ngx-fileupload-ui/upload-toolbar";
import { FileBrowserPo } from "../support/ngx-fileupload-ui/file-browser.po";

describe("Ngx Fileupload Default View", () => {

    let server: ChildProcess;
    const ngxFileUpload: NgxFileuploadPO = new NgxFileuploadPO();
    const uploadToolbar: UploadToolbarPO = new UploadToolbarPO();
    const fileBrowser: FileBrowserPo     = new FileBrowserPo();
    const dashboard: Dashboard = new Dashboard();

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

        await dashboard.navigateTo();
    });

    describe("initialize app", () => {
        it("expect upload informations to be shown", async () => {
            expect(await fileBrowser.fileBrowser.getText()).toEqual("Drag/Drop files here or click");
        });
    });

    describe("cancel action should remove all uploads", () => {

        beforeAll(async () => {
            await fileBrowser.dropFiles(["./upload-file.zip", "./upload-file.txt"]);
        });

        it("should remove all uploads at once", async () => {
            expect(ngxFileUpload.getUploadItems().count()).toBe(2);
            await uploadToolbar.removeAll();
            expect(ngxFileUpload.getUploadItems().count()).toBe(0);
        });
    });

    describe("upload all action, should start all uploads at once", () => {

        /** clear log file first to be sure all is working */
        beforeAll(() => {
            writeFileSync("./server/upload.log", "", { encoding: "utf8", flag: "w"});
        });

        it("should upload all files to server at once", async () => {
            await fileBrowser.dropFiles([ "./upload-file.zip", "./upload-file2.zip" ]);
            await uploadToolbar.uploadAll();

            const uploadingItems = await ngxFileUpload.getUploadItems()
                .all(by.css(".upload-item--state i"))
                .map<string>(el => el?.getAttribute("class"));

            expect(uploadingItems).toEqual([
                "ngx-fileupload-icon--completed success",
                "ngx-fileupload-icon--completed success"
            ]);
        });

        afterAll(async () => {
            await uploadToolbar.removeAll();
        });
    });

    describe("testing single fileupload", () => {

        beforeEach(async () => {
            await fileBrowser.dropFile("./upload-file.zip");

            /**
             * ngx-fileupload-storage sends emits after 50ms
             * so it will not rendered directly and we have to wait for it,
             * if this is not inserted after 5 seconds timeout
             */
            await browser.wait(ngxFileUpload.getUploadItems().isPresent(), 5000);
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
            expect(await buttons.map<string>(button => button?.getAttribute("class")))
                .toEqual(["item-action--upload", "item-action--cancel"]);

            // cancel button should disabled if item has state idle
            expect(await buttons.map<boolean>(button => button?.isEnabled())).toEqual([true, false]);
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

        it("should start upload, cancel and reload", async () => {

            // slow down upload
            slowDownUpload();

            const item = ngxFileUpload.getUploadItems().first();
            const uploadAction = item.element(by.css(".upload-item--body .item-action--upload"));
            const cancelAction = item.element(by.css(".upload-item--body .item-action--cancel"));

            await browser.waitForAngularEnabled(false);
            await uploadAction.click();
            await browser.sleep(500);
            await cancelAction.click();
            // wait for request has been completed
            await browser.waitForAngularEnabled(true);

            const reloadAction = item.element(by.css(".upload-item--body .item-action--reload"));

            expect(await uploadAction.isPresent()).toBeFalsy();
            expect(await reloadAction.isPresent()).toBeTruthy();

            await reloadAction.click();

            const message = await item.element(by.css(".upload-item--footer")).getText();
            expect(message).toBe("Hoooray File: upload-file.zip uploaded to /dev/null");
        });

        it("should upload item, but response with error", async () => {
            /** tell our server what to respond */
            server.send({
                response: {
                    state: 401,
                    body: ["e2e error", "forbidden"]
                }
            });

            await uploadToolbar.uploadAll();
            const errorList = ngxFileUpload.getUploadItems().first().all(by.css(".upload-item--response-errors li"));
            expect(await errorList.count()).toBe(2);

            const messages = errorList.map((el) => el?.getText());
            expect(await messages).toEqual(["e2e error", "forbidden"]);
        });

        afterEach(async () => {
            await uploadToolbar.removeAll();
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
                // slow down server response for 5 seconds, otherwise it is too fast
                timeout: 5000
            });

            /** dont wait for angular since we dont want to know a upload process has been finished */
            await browser.waitForAngularEnabled(false);
            await uploadToolbar.uploadAll();
            await browser.sleep(100);

            const items = ngxFileUpload.getUploadItems()
                .all(by.css(`.upload-item--state`));

            expect(await items.all(by.css("i.ngx-fileupload-icon--progress")).count()).toBe(3);
            expect(await items.all(by.css("i.ngx-fileupload-icon--pending")).count()).toBe(7);

            await uploadToolbar.removeAll();
            await browser.waitForAngularEnabled(true);
        });
    });

    afterAll(() => {
        server.kill("SIGINT");
    });
});
