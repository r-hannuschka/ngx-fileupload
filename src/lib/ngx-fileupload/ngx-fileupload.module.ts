import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UploadItemComponent } from './components/upload-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BytesPipe } from 'angular-pipes';
import { NgxFileuploadDirective } from './directives/ngx-fileuplad';
import { UploadComponent } from './components/upload.component';

@NgModule( {
    declarations: [
        NgxFileuploadDirective,
        UploadItemComponent,
        UploadComponent,
        BytesPipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    exports: [
        NgxFileuploadDirective,
        UploadItemComponent,
        UploadComponent
    ]
})
export class NgxFileuploadModule {}
