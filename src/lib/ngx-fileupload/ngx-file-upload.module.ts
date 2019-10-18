import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { UploadViewComponent, FileBrowserDirective, UploadItemComponent } from "./ui";
import { FileSizePipe } from "./utils/ui/file-size.pipe";

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
