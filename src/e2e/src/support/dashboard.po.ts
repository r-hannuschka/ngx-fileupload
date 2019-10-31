import { browser } from "protractor";

export class Dashboard {

    async navigateTo() {
        await browser.get(browser.baseUrl);
    }
}
