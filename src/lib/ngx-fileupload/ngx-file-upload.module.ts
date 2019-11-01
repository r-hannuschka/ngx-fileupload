import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { UploadViewComponent, FileBrowserDirective, UploadItemComponent, UploadToolbarComponent } from "./libs/ui";
import { FileSizePipe } from "./libs/utils/file-size.pipe";
import { StateToStringPipe } from "./libs/utils/state-to-string.pipe";
import { CancelAblePipe } from "./libs/utils/cancelable.pipe";

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
        StateToStringPipe,
        FileSizePipe,
        CancelAblePipe
    ]
})
export class NgxFileUploadModule {}
