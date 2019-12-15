import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IgxTabsModule } from "igniteui-angular";
import { HighlightModule } from "ngx-highlightjs";

import { NgxDropzoneModule } from "ngx-dropzone";
import { NgxDropZoneDemoComponent } from "./ngx-dropzone";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        NgxDropzoneModule,
        IgxTabsModule,
        HighlightModule,
        NgxFileUploadUiCommonModule,
        NgxFileUploadUiProgressbarModule,
        RouterModule.forChild([
        {
            path: "ngx-dropzone",
            component: NgxDropZoneDemoComponent
        }
    ])],
    exports: [RouterModule],
    declarations: [NgxDropZoneDemoComponent],
    entryComponents: [NgxDropZoneDemoComponent],
    providers: [],
})
export class Page { }
