import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NgxFileUploadModule } from "lib/public-api";

@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgxFileUploadModule
    ],
    bootstrap: [AppComponent],
} )
export class AppModule { }
