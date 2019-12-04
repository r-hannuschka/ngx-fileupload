import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { environment } from "../environments/environment";

import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { IgxIconModule } from "igniteui-angular";
import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FakeUploadInterceptor } from "@ngx-fileupload-example/utils/http";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { UiModule } from "@ngx-fileupload-example/ui";
import { CustomizePage } from "@ngx-fileupload-example/page/customize";
import { Dashboard } from "@ngx-fileupload-example/page/dashboard";
import { ValidationPage } from "@ngx-fileupload-example/page/validation";
import { DropZone } from "@ngx-fileupload-example/page/drop-zone";
import { AutoUploadDemo } from "@ngx-fileupload-example/page/auto-upload";

const fakeUploadProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeUploadInterceptor,
    multi: true
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgxFileUploadModule,
        RouterModule.forRoot([], {useHash: true}),
        IgxIconModule,
        HighlightModule,
        // app module
        UiModule,

        // pages
        AutoUploadDemo,
        CustomizePage,
        Dashboard,
        ValidationPage,
        DropZone,
    ],
    bootstrap: [AppComponent],
    providers: [
        ...environment.demo ? [fakeUploadProvider] : [],
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                languages: {
                    typescript: () => import("highlight.js/lib/languages/typescript"),
                    scss: () => import("highlight.js/lib/languages/scss"),
                    xml: () => import("highlight.js/lib/languages/xml")
                }
            }
        }
    ]
})
export class AppModule {
}
