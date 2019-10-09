import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HighlightModule } from "ngx-highlightjs";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { IgxTabsModule } from "igniteui-angular";

import { UiModule } from "@ngx-fileupload-example/ui";
import { ItemTemplateRoutes } from "./routes";

import { BaseItemComponent } from "./base/base-item.component";
import { ItemTemplateComponent } from "./item-template/item-template.component";
import { ErrorMessageComponent } from "./error-message/error-message.component";
import { CustomizeComponent } from "./customize.component";
import { ValidationMessageComponent } from "./validation-message/validation-message.component";

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
        BaseItemComponent,
        CustomizeComponent,
        ItemTemplateComponent,
        ValidationMessageComponent,
        ErrorMessageComponent,
    ],
    entryComponents: [
        CustomizeComponent
    ],
    providers: [],
})
export class CustomizePage {}
