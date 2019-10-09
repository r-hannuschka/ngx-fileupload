
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { HighlightModule } from "ngx-highlightjs";
import { IgxTabsModule } from "igniteui-angular";

import { ValidationPageComponent } from "./validation-page/validation-page.component";
import { BaseComponent } from "./base/base.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: "validation",
            component: ValidationPageComponent
        }]),
        NgxFileUploadModule,
        HighlightModule,
        IgxTabsModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        ValidationPageComponent,
        BaseComponent
    ],
    entryComponents: [
        ValidationPageComponent
    ],
    providers: [],
})
export class ValidationPage {}
