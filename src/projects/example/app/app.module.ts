import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { environment } from "../environments/environment";

import { IgxIconModule } from "igniteui-angular";
import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FakeUploadInterceptor } from "projects/example/libs/utils/http";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxFileUploadCoreModule } from "@ngx-file-upload/core";

import { UiModule } from "projects/example/libs/ui";
import { CustomizePage } from "projects/example/libs/pages/customize";
import { Dashboard } from "projects/example/libs/pages/dashboard";
import { ValidationPage } from "projects/example/libs/pages/validation";
import { DropZone } from "projects/example/libs/pages/drop-zone";
import { AutoUploadDemo } from "projects/example/libs/pages/auto-upload";

const fakeUploadProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeUploadInterceptor,
    multi: true
};

export function getHighlightLanguages() {
    return {
        typescript: () => import("highlight.js/lib/languages/typescript"),
        scss: () => import("highlight.js/lib/languages/scss"),
        xml: () => import("highlight.js/lib/languages/xml")
    };
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([], { useHash: true }),
        IgxIconModule,
        HighlightModule,
        // app module
        NgxFileUploadCoreModule,
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
                coreLibraryLoader: () => import("highlight.js/lib/core"),
                languages: getHighlightLanguages()
            }
        }
    ]
})
export class AppModule {
}
