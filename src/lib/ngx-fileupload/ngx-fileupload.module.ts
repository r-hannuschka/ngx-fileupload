import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UploadItemComponent } from './components/upload-item.component';
import { NgxFileuploadDirective } from './directives/ngx-fileuplad';
import { UploadComponent } from './components/upload.component';

@NgModule( {
    declarations: [
        NgxFileuploadDirective,
        UploadItemComponent,
        UploadComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [
        NgxFileuploadDirective,
        UploadItemComponent,
        UploadComponent
    ]
})
export class NgxFileuploadModule {}
