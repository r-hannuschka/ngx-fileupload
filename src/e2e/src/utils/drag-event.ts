/**
 * helper to simulate file drop
 *
 * @see https://stackoverflow.com/questions/37547182/simulate-drag-and-drop-of-file-to-upload-in-protractor
 */
import { accessSync } from "fs";
import { resolve } from "path";
import { F_OK } from "constants";
import { browser, ElementFinder } from "protractor";

const JS_BIND_INPUT = (target: HTMLElement) => {

    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.style.display = "none";
    input.addEventListener("change", () => {
        target.scrollIntoView( true );

        const rect = target.getBoundingClientRect();
        const x = rect.left + rect.width;
        const y = rect.top + rect.height;
        const data = { files: input.files };

        ["dragenter", "dragover", "drop"].forEach((name) => {
            const event: any = document.createEvent("MouseEvent");
            event.initMouseEvent( name, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null );
            event.dataTransfer = data;
            target.dispatchEvent(event);
        });

        document.body.removeChild(input);
    }, false );

    document.body.appendChild(input);
    return input;
};

/**
 * Support function to drop a file to a drop area.
 *
 * @view
 * <div id="drop-area"></div>
 *
 * @example
 * dropFile($("#drop-area"), "./image.png");
 */
export async function simulateDrop(dropArea: ElementFinder, file: string[] | string) {

    const files    = Array.isArray(file) ? file : [file];
    const filePath: string[] = files.map((sourceFile) => {
        const path = resolve(__dirname, `../data/${sourceFile}`);
        accessSync(path, F_OK);
        return path;
    });

    const element    = await dropArea.getWebElement();
    const input: any = await browser.executeScript(JS_BIND_INPUT, element);
    input.sendKeys(filePath.join("\n"));
}
