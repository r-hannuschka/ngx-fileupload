import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppUploadModule } from './app-upload.module';

@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        AppUploadModule,
        BrowserModule
    ],
    bootstrap: [AppComponent],
} )
export class AppModule { }
