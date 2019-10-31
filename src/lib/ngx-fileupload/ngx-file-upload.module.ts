import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { UploadViewComponent, FileBrowserDirective, UploadItemComponent, UploadToolbarComponent } from "./libs/ui";
import { FileSizePipe } from "./utils/file-size.pipe";
import { StateToStringPipe } from "./utils/state-to-string.pipe";

@NgModule({
    declarations: [
        FileBrowserDirective,
        UploadItemComponent,
        UploadViewComponent,
        UploadToolbarComponent,
        StateToStringPipe,
        FileSizePipe
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
        FileSizePipe
    ]
})
export class NgxFileUploadModule {}
