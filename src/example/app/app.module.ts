import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { RouterModule } from "@angular/router";

import { UiModule } from "@ngx-fileupload-example/ui";

import { AppComponent } from "./app.component";
import { ItemTemplateDemo } from "@ngx-fileupload-example/item-template";
import { Dashboard } from "@ngx-fileupload-example/dashboard";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgxFileUploadModule,
        RouterModule.forRoot([]),
        ItemTemplateDemo,
        Dashboard,
        UiModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
