import { simulateDrop } from "../../utils/drag-event";
import { by, browser, logging } from "protractor";
import { spawn, ChildProcess } from "child_process";
import { writeFileSync } from "fs";
import { NgxFileuploadPO } from "../support/ngx-fileupload.po";
import { Dashboard } from "../support/dashboard.po";

describe("workspace-project App", () => {

    let server: ChildProcess;
    let ngxFileUpload: NgxFileuploadPO;
    let dashboard: Dashboard;

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
            const items        = ngxFileUpload.getUploadItems();
            const cancelAction = ngxFileUpload.getCancelButton();

            expect(items.count()).toBe(2);
            await cancelAction.click();
            expect(items.count()).toBe(0);
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
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file2.zip");
        });

        it("should upload all files to server at once", async () => {
            const uploadAction = ngxFileUpload.getUploadButton();
            await uploadAction.click();
        });

        afterAll(async () => {
            await ngxFileUpload.getCancelButton().click();
        });
    });

    describe("add file to upload", () => {

        beforeAll(async () => {
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
        });

        it("should enable all buttons", async () => {
            expect(await ngxFileUpload.getUploadButton().isEnabled()).toBeTruthy();
            expect(await ngxFileUpload.getCancelButton().isEnabled()).toBeTruthy();
            expect(await ngxFileUpload.getCleanButton().isEnabled()).toBeTruthy();
        });

        it("should display upload file in list", async () => {
            await ngxFileUpload.getUploadList().isPresent();
            expect(await ngxFileUpload.getUploadList().isDisplayed()).toBeTruthy();
            expect(await ngxFileUpload.getUploadItems().count()).toBe(1);
        });

        it("upload should have icon idle", async () => {
            const uploadItem = ngxFileUpload.getUploadItems().get(0);
            const queuedIcon = uploadItem.element(by.css(".ngx-fileupload-icon--idle"));

            expect(await queuedIcon.isDisplayed()).toBeTruthy();
        });

        it("should contain upload / cancel button", async () => {
            const uploadItem   = ngxFileUpload.getUploadItems().get(0);
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));
            const stopAction   = uploadItem.element(by.css(".item-action--cancel"));

            expect(await uploadAction.isDisplayed());
            expect(await stopAction.isDisplayed());
        });

        it("upload button should be enabled", async () => {
            const uploadItem   = ngxFileUpload.getUploadItems().get(0);
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));

            expect(await uploadAction.isEnabled()).toBeTruthy();
        });

        /**
         * if no server is running / wrong url is passed it could not
         * reached and should display error
         */
        it("should fail with 401, show reload btn", async () => {

            /** tell our server what to response */
            server.send({
                response: {
                    state: 401,
                    body: {
                        message: "forbidden"
                    }
                },
                timeout: 0
            });

            const uploadItem   = ngxFileUpload.getUploadItems().get(0);
            const errorIcon    = uploadItem.element(by.css(".ngx-fileupload-icon--completed.error"));
            const retryAction  = uploadItem.element(by.css(".item-action--reload"));
            const uploadAction = uploadItem.element(by.css(".item-action--upload"));

            await uploadAction.click();

            expect(uploadAction.isPresent()).toBeFalsy();
            expect(retryAction.isPresent()).toBeTruthy();
            expect(retryAction.isDisplayed()).toBeTruthy();
            expect(errorIcon.isDisplayed()).toBeTruthy();
        });

        afterAll(async () => {
            /** clean up all uploads */
            await ngxFileUpload.getCancelButton().click();
        });
    });

    describe("testing queue", () => {

        /** clear log file first to be sure all is working */
        beforeAll(() => {
            writeFileSync("./server/upload.log", "", { encoding: "utf8", flag: "w"});
        });

        it("should add 10 files", async () => {
            for (let i = 0; i < 10; i++) {
                await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
            }
        });

        it("should have added 10 files to list", async () => {
            expect(await ngxFileUpload.getUploadItems().count()).toBe(10);
        });

        it("should only upload 3 files at once and get 7 queued", async () => {

            server.send({
                response: null,
                // slow down server response for 1 second, otherwise it is too fast
                timeout: 1000
            });

            /** scroll to upload button to avoid element could not be clicked */
            const location = await ngxFileUpload.getUploadButton().getLocation();
            await browser.executeScript(`scrollTo(${location.y}, ${location.x})`);
            ngxFileUpload.getUploadButton().click();

            /** dont wait for angular since we dont want to know a upload process has been finished */
            await browser.waitForAngularEnabled(false);
            await browser.sleep(100);

            const pending = await ngxFileUpload.getUploadItems()
                .all(by.css(`.upload-item--state i`))
                .filter((elem) => elem.getAttribute("class")
                    .then((className) => {
                        return className === "ngx-fileupload-icon--pending";
                    })
                );

            browser.waitForAngularEnabled(true);
            expect(pending.length).toBe(7);
        });

        afterAll(() => {
            ngxFileUpload.getCancelButton().click();
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
