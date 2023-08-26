import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IgxTabsModule } from "igniteui-angular";
import { HighlightModule } from "ngx-highlightjs";

import { NgxDropZoneDemoComponent } from "./ngx-dropzone";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule, NgxFileUploadUiToolbarModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        IgxTabsModule,
        HighlightModule,
        NgxFileUploadUiCommonModule,
        NgxFileUploadUiToolbarModule,
        NgxFileUploadUiProgressbarModule,
        RouterModule.forChild([
            {
                path: "ngx-dropzone",
                component: NgxDropZoneDemoComponent
            }
        ])
    ],
    exports: [RouterModule],
    declarations: [NgxDropZoneDemoComponent],
    providers: []
})
export class Page { }
