import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IgxTabsModule } from "igniteui-angular";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { UiModule } from "@ngx-fileupload-example/ui";
import { DemoComponent } from "./demo/demo";
import { HighlightModule } from "ngx-highlightjs";

@NgModule({
    imports: [
        NgxFileUploadModule,
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
    entryComponents: [DemoComponent],
    providers: [],
})
export class AutoUploadDemo { }
