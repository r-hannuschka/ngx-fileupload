import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FileBrowserDirective } from './ui/src/file-browser';
import { UploadItemComponent } from './ui/src/upload-item.component';
import { UploadToolbarComponent } from './ui/src/upload-toolbar';
import { UploadViewComponent } from './ui/src/upload-view';

import { CancelAblePipe } from "./utils/src/cancelable.pipe";
import { FileSizePipe } from "./utils/src/file-size.pipe";
import { StateToStringPipe } from "./utils/src/state-to-string.pipe";

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
    imports: [ CommonModule ],
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
export class NgxFileUploadUiModule {}
