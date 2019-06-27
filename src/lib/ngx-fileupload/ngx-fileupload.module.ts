import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UploadItemComponent } from './components/upload-item.component';
import { NgxFileuploadDirective } from './directives/ngx-fileuplad';
import { UploadComponent } from './components/upload.component';
import { BytesPipe } from 'angular-pipes';

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
    ],
    exports: [
        NgxFileuploadDirective,
        UploadItemComponent,
        UploadComponent
    ]
})
export class NgxFileuploadModule {}
