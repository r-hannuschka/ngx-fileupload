import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FileBrowserDirective } from "./common/src/file-browser";
import { UploadItemComponent } from "./common/src/upload-item.component";
import { UploadViewComponent } from "./common/src/upload-view";

import { CancelAblePipe } from "./utils/src/cancelable.pipe";
import { FileSizePipe } from "./utils/src/file-size.pipe";
import { StateToStringPipe } from "./utils/src/state-to-string.pipe";
import { UploadToolbarModule } from './toolbar';
import { ProgressBarModule } from './progressbar';

@NgModule({
    declarations: [
        FileBrowserDirective,
        UploadItemComponent,
        UploadViewComponent,
        StateToStringPipe,
        FileSizePipe,
        CancelAblePipe
    ],
    imports: [
        CommonModule,
        UploadToolbarModule,
        ProgressBarModule
    ],
    exports: [
        FileBrowserDirective,
        UploadItemComponent,
        UploadViewComponent,
        StateToStringPipe,
        FileSizePipe,
        CancelAblePipe,
        ProgressBarModule,
        UploadToolbarModule
    ]
})
export class NgxFileUploadUiModule {}
