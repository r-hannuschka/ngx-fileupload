import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxFileuploadModule } from 'lib/public-api';

@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgxFileuploadModule
    ],
    bootstrap: [AppComponent]
} )
export class AppModule { }
