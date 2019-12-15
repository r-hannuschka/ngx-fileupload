import { NgModule } from '@angular/core';
import { UploadItemComponent } from "./src/upload-item";
import { CommonModule } from '@angular/common';
import { NgxFileUploadUiCommonModule } from '../common/main';

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadUiCommonModule
    
    ],
    exports: [UploadItemComponent],
    declarations: [UploadItemComponent],
    providers: [],
})
export class UploadItemModule { }
