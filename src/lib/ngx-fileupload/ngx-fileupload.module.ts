import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DropZoneDirective } from './directives/drop-zone';
import { UploadItemComponent } from './components/upload-item.component';

@NgModule( {
    declarations: [
        DropZoneDirective,
        UploadItemComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [
        DropZoneDirective,
        UploadItemComponent
    ]
})
export class NgxFileuploadModule {}
