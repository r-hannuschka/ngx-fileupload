import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UploadItemComponent } from './components/upload-item.component';
import { NgxFileuploadDirective } from './directives/ngx-fileuplad';

@NgModule( {
    declarations: [
        NgxFileuploadDirective,
        UploadItemComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [
        NgxFileuploadDirective,
        UploadItemComponent
    ]
})
export class NgxFileuploadModule {}
