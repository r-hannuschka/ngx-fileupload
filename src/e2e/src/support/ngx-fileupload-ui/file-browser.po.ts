import { simulateDrop } from "../../utils/drag-event";
import { by, element } from "protractor";

export class FileBrowserPo {

    public get fileBrowser() {
        return element(by.css(".file-browser"));
    }

    public async dropFile(file: string) {
        await simulateDrop(this.fileBrowser, file);
    }

    public async dropFiles(files: string[]) {
        await simulateDrop(this.fileBrowser, files);
    }
}

