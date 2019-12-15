import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxFileUploadUiCommonModule } from "../common/main";
import { UploadItemComponent } from "./src/upload-item";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadUiCommonModule
    ],
    exports: [UploadItemComponent],
    declarations: [UploadItemComponent],
    providers: [],
})
export class NgxFileUploadUiItemModule { }
