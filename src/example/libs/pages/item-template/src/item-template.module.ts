import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HighlightModule } from "ngx-highlightjs";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { IgxTabsModule, IgxIconModule } from "igniteui-angular";

import { UiModule } from "@ngx-fileupload-example/ui";
import { ItemTemplateRoutes } from "./routes";

import { BaseItemComponent } from "./base/base-item.component";
import { CircleProgressbarComponent } from "./circle-progressbar/circle-progressbar.component";
import { ErrorMessageComponent } from "./error-message/error-message.component";
import { ItemTemplateComponent } from "./item-template/item-template.component";
import { ValidationMessageComponent } from "./validation-message/validation-message.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ItemTemplateRoutes),
        NgxFileUploadModule,
        UiModule,
        HighlightModule,
        IgxTabsModule,
        IgxIconModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        BaseItemComponent,
        ItemTemplateComponent,
        CircleProgressbarComponent,
        ValidationMessageComponent,
        ErrorMessageComponent,
    ],
    entryComponents: [
        ItemTemplateComponent
    ],
    providers: [],
})
export class ItemTemplateDemo {}
