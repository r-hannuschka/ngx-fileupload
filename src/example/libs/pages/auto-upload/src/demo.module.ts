import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { UiModule } from "@ngx-fileupload-example/ui";
import { DemoComponent } from "./demo/demo";

@NgModule({
    imports: [
        NgxFileUploadModule,
        UiModule,
        RouterModule.forChild([
        {
            path: "auto-upload",
            component: DemoComponent
        }
    ])],
    exports: [RouterModule],
    declarations: [DemoComponent],
    entryComponents: [DemoComponent],
    providers: [],
})
export class AutoUploadDemo { }
