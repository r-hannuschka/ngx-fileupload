import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMathPipesModule } from 'angular-pipes';

import { UploadItemComponent } from './components/upload-item.component';
import { NgxFileuploadDirective } from './directives/ngx-fileuplad';
import { UploadComponent } from './components/upload.component';

@NgModule( {
    declarations: [
        NgxFileuploadDirective,
        UploadItemComponent,
        UploadComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgMathPipesModule
    ],
    exports: [
        NgxFileuploadDirective,
        UploadItemComponent,
        UploadComponent
    ]
})
export class NgxFileuploadModule {}
