import { Dashboard } from "../support/dashboard.po";

describe("Ngx Fileupload Upload File Browser", () => {

    const dashboard: Dashboard = new Dashboard();

    beforeAll(async () => {
        await dashboard.navigateTo();
    });

    it("add new file: enabled buttons upload and remove, disabled buttons clear", async () => {
    });
});
