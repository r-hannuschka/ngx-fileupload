import { browser } from "protractor";

export class Dashboard {

    navigateTo() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }
}
