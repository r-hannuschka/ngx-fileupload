import { NgModule } from "@angular/core";
import { DropZoneComponent } from "./ui/drop-zone";
import { RouterModule } from "@angular/router";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { UiModule } from "@ngx-fileupload-example/ui";
import { NgxFileDropModule } from "ngx-file-drop";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        NgxFileUploadModule,
        UiModule,
        NgxFileDropModule,
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
