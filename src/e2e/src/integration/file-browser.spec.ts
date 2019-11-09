import { Dashboard } from "../support/dashboard.po";
import { UploadToolbarPO } from "../support/ngx-fileupload-ui/upload-toolbar";
import { FileBrowserPo } from "../support/ngx-fileupload-ui/file-browser.po";

describe("Ngx Fileupload Upload File Browser", () => {

    const fileBrowser = new FileBrowserPo();
    const uploadToolbar: UploadToolbarPO = new UploadToolbarPO();
    const dashboard: Dashboard = new Dashboard();

    beforeAll(async () => {
        await dashboard.navigateTo();
    });

    it("add new file: enabled buttons upload and remove, disabled buttons clear", async () => {
    });
});
