import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { RouterModule } from "@angular/router";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { UiModule } from "@ngx-fileupload-example/ui";
import { FakeUploadInterceptor } from "@ngx-fileupload-example/utils/http";

import { AppComponent } from "./app.component";
import { ItemTemplateDemo } from "@ngx-fileupload-example/page/item-template";
import { Dashboard } from "@ngx-fileupload-example/page/dashboard";

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
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: FakeUploadInterceptor,
            multi: true
        }
    ]
})
export class AppModule { }
