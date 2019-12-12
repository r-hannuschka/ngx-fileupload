import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UploadViewComponent, FileBrowserDirective, UploadItemComponent, UploadToolbarComponent } from "./ui";
import { FileSizePipe, StateToStringPipe, CancelAblePipe } from "./utils";

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