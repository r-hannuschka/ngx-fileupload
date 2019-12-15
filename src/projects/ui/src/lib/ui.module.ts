import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UploadViewComponent } from "./common/src/upload-view";

import { UploadToolbarModule } from './toolbar/main';
import { ProgressBarModule } from './progressbar/main';
import { FileBrowserModule } from './file-browser/main';
import { UploadItemModule } from "./upload-item/main";
import { NgxFileUploadUiCommonModule } from "./common/main";

@NgModule({
    declarations: [
        UploadViewComponent,
    ],
    imports: [
        CommonModule,
        FileBrowserModule,
        NgxFileUploadUiCommonModule,
        ProgressBarModule,
        UploadToolbarModule,
        UploadItemModule
    ],
    exports: [
        FileBrowserModule,
        NgxFileUploadUiCommonModule,
        ProgressBarModule,
        UploadItemModule,
        UploadToolbarModule,
        UploadViewComponent,
    ]
})
export class NgxFileUploadUiModule {}
