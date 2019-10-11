import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HighlightModule } from "ngx-highlightjs";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { IgxTabsModule } from "igniteui-angular";

import { UiModule } from "@ngx-fileupload-example/ui";
import { ItemTemplateRoutes } from "./routes";

import { FileSelectComponent } from "./file-select/file-select.component";
import { ItemTemplateComponent } from "./item-template/item-template.component";
import { CustomizeComponent } from "./customize.component";

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
        FileSelectComponent,
        CustomizeComponent,
        ItemTemplateComponent
    ],
    entryComponents: [
        CustomizeComponent
    ],
    providers: [],
})
export class CustomizePage {}