import { NgModule } from "@angular/core";
import { ItemTemplateComponent } from "./item-template/item-template.component";
import { RouterModule } from "@angular/router";
import { ItemTemplateRoutes } from "./routes";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { CommonModule } from "@angular/common";
import { UiModule } from "@ngx-fileupload-example/ui";

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
        ItemTemplateComponent
    ],
    entryComponents: [
        ItemTemplateComponent
    ],
    providers: [],
})
export class ItemTemplateDemo {
}
