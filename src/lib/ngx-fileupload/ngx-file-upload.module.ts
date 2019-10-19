import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { UploadViewComponent, FileBrowserDirective, UploadItemComponent } from "./libs/ui";
import { FileSizePipe } from "./utils/file-size.pipe";

@NgModule({
    declarations: [
        FileBrowserDirective,
        UploadItemComponent,
        UploadViewComponent,
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
        FileSizePipe
    ]
})
export class NgxFileUploadModule {}
