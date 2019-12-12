import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HighlightModule } from "ngx-highlightjs";
import { NgxFileUploadModule } from "projects/ngx-fileupload/public-api";
import { IgxTabsModule } from "igniteui-angular";

import { UiModule } from "@ngx-fileupload-example/ui";
import { ItemTemplateRoutes } from "./routes";

import { ItemTemplateComponent } from "./item-template/item-template.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ItemTemplateRoutes),
        NgxFileUploadModule,
        UiModule,
        HighlightModule,
        IgxTabsModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        ItemTemplateComponent
    ],
    entryComponents: [
        ItemTemplateComponent
    ],
    providers: [],
})
export class CustomizePage {}
