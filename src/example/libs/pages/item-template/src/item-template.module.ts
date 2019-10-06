import { NgModule } from "@angular/core";
import { ItemTemplateComponent } from "./item-template/item-template.component";
import { RouterModule } from "@angular/router";
import { ItemTemplateRoutes } from "./routes";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { CommonModule } from "@angular/common";
import { UiModule } from "@ngx-fileupload-example/ui";

import { BaseItemComponent } from "./base/base-item.component";
import { CircleProgressbarComponent } from "./circle-progressbar/circle-progressbar.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ItemTemplateRoutes),
        NgxFileUploadModule,
        UiModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        ItemTemplateComponent,
        CircleProgressbarComponent,
        BaseItemComponent
    ],
    entryComponents: [
        ItemTemplateComponent
    ],
    providers: [],
})
export class ItemTemplateDemo {
}
