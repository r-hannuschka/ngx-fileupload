import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyModule } from './submodule/my.module';

@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        MyModule
    ],
    bootstrap: [AppComponent]
} )
export class AppModule { }
