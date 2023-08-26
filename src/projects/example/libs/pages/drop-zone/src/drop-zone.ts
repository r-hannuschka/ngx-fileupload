import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule, NgxFileUploadUiToolbarModule } from "@ngx-file-upload/ui";
import { IgxTabsModule } from "igniteui-angular";
import { HighlightModule } from "ngx-highlightjs";

import { DropZoneComponent } from "./ui/drop-zone";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadUiToolbarModule,
        NgxFileUploadUiProgressbarModule,
        NgxFileUploadUiCommonModule,
        IgxTabsModule,
        HighlightModule,
        RouterModule.forChild([
            {
                path: "drop-zone",
                component: DropZoneComponent
            }
        ])
    ],
    exports: [RouterModule],
    declarations: [DropZoneComponent],
    providers: []
})
export class DropZone { }
