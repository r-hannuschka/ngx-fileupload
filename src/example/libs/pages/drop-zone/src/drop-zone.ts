import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxFileUploadModule } from "projects/ngx-fileupload/public-api";
import { UiModule } from "@ngx-fileupload-example/ui";
import { NgxFileDropModule } from "ngx-file-drop";
import { IgxTabsModule } from "igniteui-angular";
import { HighlightModule } from "ngx-highlightjs";

import { DropZoneComponent } from "./ui/drop-zone";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadModule,
        UiModule,
        NgxFileDropModule,
        IgxTabsModule,
        HighlightModule,
        RouterModule.forChild([
        {
            path: "drop-zone",
            component: DropZoneComponent
        }
    ])],
    exports: [RouterModule],
    declarations: [DropZoneComponent],
    entryComponents: [DropZoneComponent],
    providers: [],
})
export class DropZone { }
