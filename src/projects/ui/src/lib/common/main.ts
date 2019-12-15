export * from "./src/upload-view";

import { NgModule } from "@angular/core";
import { CancelAblePipe } from "./src/cancelable.pipe";
import { FileSizePipe } from "./src/file-size.pipe";
import { StateToStringPipe } from "./src/state-to-string.pipe";

@NgModule({
    imports: [],
    exports: [
        StateToStringPipe,
        FileSizePipe,
        CancelAblePipe
    ],
    declarations: [
        StateToStringPipe,
        FileSizePipe,
        CancelAblePipe
    ],
    providers: [],
})
export class NgxFileUploadUiCommonModule { }
