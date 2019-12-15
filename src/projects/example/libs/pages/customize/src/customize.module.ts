import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HighlightModule } from "ngx-highlightjs";
import { NgxFileUploadUiProgressbarModule, NgxFileUploadUiCommonModule } from '@ngx-file-upload/ui';
import { IgxTabsModule } from "igniteui-angular";

import { UiModule } from "projects/example/libs/ui";
import { ItemTemplateRoutes } from "./routes";

import { ItemTemplateComponent } from "./item-template/item-template.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ItemTemplateRoutes),
        NgxFileUploadUiProgressbarModule,
        NgxFileUploadUiCommonModule,
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
