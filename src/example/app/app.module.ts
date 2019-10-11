import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { IgxIconModule } from "igniteui-angular";
import { HighlightModule } from "ngx-highlightjs";
import xml from "highlight.js/lib/languages/xml";
import scss from "highlight.js/lib/languages/scss";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";

/**
 * Import every language you wish to highlight here
 * NOTE: The name of each language must match the file name its imported from
 */
export function hljsLanguages() {
  return [
    {name: "typescript", func: typescript},
    {name: "javascript", func: javascript},
    {name: "scss", func: scss},
    {name: "xml", func: xml}
  ];
}

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { UiModule } from "@ngx-fileupload-example/ui";
import { FakeUploadInterceptor } from "@ngx-fileupload-example/utils/http";
import { CustomizePage } from "@ngx-fileupload-example/page/customize";
import { Dashboard } from "@ngx-fileupload-example/page/dashboard";
import { ValidationPage } from "@ngx-fileupload-example/page/validation";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgxFileUploadModule,
        RouterModule.forRoot([], {useHash: true}),
        CustomizePage,
        Dashboard,
        ValidationPage,
        UiModule,
        IgxIconModule,
        HighlightModule.forRoot({
            languages: hljsLanguages
        })
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
