import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { UploadViewComponent, FileBrowserDirective, UploadItemComponent, UploadToolbarComponent } from "./src/libs/ui";
import { FileSizePipe } from "./src/libs/utils/src/file-size.pipe";
import { StateToStringPipe } from "./src/libs/utils/src/state-to-string.pipe";
import { CancelAblePipe } from "./src/libs/utils/src/cancelable.pipe";

@NgModule({
    declarations: [
        FileBrowserDirective,
        UploadItemComponent,
        UploadViewComponent,
        UploadToolbarComponent,
        StateToStringPipe,
        FileSizePipe,
        CancelAblePipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    exports: [
        FileBrowserDirective,
        UploadItemComponent,
        UploadViewComponent,
        UploadToolbarComponent,
        StateToStringPipe,
        FileSizePipe,
        CancelAblePipe
    ]
})
export class NgxFileUploadModule {}
