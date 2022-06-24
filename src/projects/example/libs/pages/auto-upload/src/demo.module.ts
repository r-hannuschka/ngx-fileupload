import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IgxTabsModule } from "igniteui-angular";
import { UiModule } from "projects/example/libs/ui";
import { DemoComponent } from "./demo/demo";
import { HighlightModule } from "ngx-highlightjs";
import { NgxFileUploadUiModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        NgxFileUploadUiModule,
        UiModule,
        RouterModule.forChild([{
                path: "auto-upload",
                component: DemoComponent
            }]),
        IgxTabsModule,
        HighlightModule
    ],
    exports: [RouterModule],
    declarations: [DemoComponent],
    providers: []
})
export class AutoUploadDemo { }
