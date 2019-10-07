import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { UploadViewComponent, UploadFileDirective, UploadItemComponent } from "@lib/ui";
import { FileSizePipe } from "@lib/utils/ui";

@NgModule({
    declarations: [
        UploadFileDirective,
        UploadItemComponent,
        UploadViewComponent,
        FileSizePipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    exports: [
        UploadFileDirective,
        UploadItemComponent,
        UploadViewComponent,
        FileSizePipe
    ]
})
export class NgxFileUploadModule {}
