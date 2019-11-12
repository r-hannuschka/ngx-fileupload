import { simulateDrop } from "../utils/drag-event";
import { browser } from "protractor";
import { spawn, ChildProcess } from "child_process";
import { Dashboard } from "../support/dashboard.po";
import { UploadToolbarPO } from "../support/ngx-fileupload-ui/upload-toolbar";
import { NgxFileuploadPO } from "../support/ngx-fileupload-ui/ngx-fileupload.po";

describe("Ngx Fileupload Upload Toolbar", () => {

    let server: ChildProcess;

    const ngxFileUpload: NgxFileuploadPO = new NgxFileuploadPO();
    const uploadToolbar: UploadToolbarPO = new UploadToolbarPO();
    const dashboard: Dashboard = new Dashboard();

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

    it("expect action buttons to be disabled", async () => {
        const buttonEnabled = uploadToolbar.actionButtons.map<boolean>((button) => button.isEnabled());
        expect(await buttonEnabled).toEqual([false, false, false]);
    });

    it("add new file: enabled buttons upload and remove, disabled buttons clear", async () => {
        await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
        const buttonEnabled = uploadToolbar.actionButtons.map<boolean>((button) => button.isEnabled());
        expect(await buttonEnabled).toEqual([true, false, true]);
    });

    it("should contain 1 idle item in info bar", async () => {
        const uploadStates = uploadToolbar.uploadStates.map<string>((state) => state.getText());
        expect(await uploadStates).toEqual(["0", "0", "1", "0"]);
    });

    it("should contain 1 progressing item in info bar", async () => {
        /** slow down upload server a bit, otherwise it is to fast */
        server.send({timeout: 1000});

        /** start uploads */
        await browser.waitForAngularEnabled(false);
        await uploadToolbar.uploadAll();
        await browser.sleep(100);

        expect(
            await uploadToolbar.uploadStates.map<string>((state) => state.getText())
        ).toEqual(["1", "0", "0", "0"]);

        await browser.waitForAngularEnabled(true);
    });

    it("should have enabled clear button after upload is completed", async () => {
        expect(await uploadToolbar.clearButton.isEnabled()).toBeTruthy();
    });

    it("should contain 3 progressing item and 7 pending in info bar", async () => {
        /** slow down upload server a bit, otherwise it is to fast */
        server.send({timeout: 1000});

        for (let i = 0; i < 10; i++) {
            await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
        }

        /** start uploads */
        await browser.waitForAngularEnabled(false);
        await uploadToolbar.uploadAll();
        await browser.sleep(100);

        expect(
            await uploadToolbar.uploadStates.map<string>((state) => state.getText())
        ).toEqual(["3", "7", "0", "0"]);
    });

    it("should contain 3 progressing, 7 pending and 1 idle in info bar", async () => {
        // add another file
        await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");

        expect(
            await uploadToolbar.uploadStates.map<string>((state) => state.getText())
        ).toEqual(["3", "7", "1", "0"]);

        /** start uploads */
        await browser.waitForAngularEnabled(true);
        await uploadToolbar.removeAll();
    });

    it("should show upload error 1 in info bar", async () => {
        server.send({
            response: {state: 401, message: "just no"}
        });

        // add another file
        await simulateDrop(ngxFileUpload.getFileBrowser(), "./upload-file.zip");
        await uploadToolbar.uploadAll();

        expect(
            await uploadToolbar.uploadStates.map<string>((state) => state.getText())
        ).toEqual(["0", "0", "0", "1"]);

        /** start uploads */
        await uploadToolbar.removeAll();
    });

    afterAll(() => {
        server.kill("SIGINT");
    });
});
