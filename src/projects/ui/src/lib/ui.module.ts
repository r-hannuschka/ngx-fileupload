import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UploadViewComponent } from "./common/src/upload-view";

import { NgxFileUploadUiToolbarModule } from "./toolbar/main";
import { NgxFileUploadUiProgressbarModule } from "./progressbar/main";
import { NgxFileUploadUiFileBrowserModule } from "./file-browser/main";
import { NgxFileUploadUiItemModule } from "./upload-item/main";
import { NgxFileUploadUiCommonModule } from "./common/main";

@NgModule({
    declarations: [
        UploadViewComponent,
    ],
    imports: [
        CommonModule,
        NgxFileUploadUiProgressbarModule,
        NgxFileUploadUiCommonModule,
        NgxFileUploadUiToolbarModule,
        NgxFileUploadUiItemModule,
        NgxFileUploadUiFileBrowserModule
    ],
    exports: [
        NgxFileUploadUiCommonModule,
        NgxFileUploadUiProgressbarModule,
        NgxFileUploadUiCommonModule,
        NgxFileUploadUiToolbarModule,
        NgxFileUploadUiItemModule,
        NgxFileUploadUiFileBrowserModule,
        UploadViewComponent,
    ]
})
export class NgxFileUploadUiModule {}
