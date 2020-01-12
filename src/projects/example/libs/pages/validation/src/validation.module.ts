
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HighlightModule } from "ngx-highlightjs";
import { IgxTabsModule } from "igniteui-angular";

import { ValidationPageComponent } from "./validation-page/validation-page.component";
import { IsImageValidationComponent } from "./is-image/is-image.component";
import { GroupAndComponent } from "./group-and/group-and.component";
import { GroupOrComponent } from "./group-or/group-or.component";
import { GroupMultipleComponent } from "./group-multiple/group-multiple.component";
import { NgxFileUploadUiModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([{
            path: "validation",
            component: ValidationPageComponent,
            data: {
                uploadOverlay: true
            }
        }]),
        NgxFileUploadUiModule,
        HighlightModule,
        IgxTabsModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        ValidationPageComponent,
        IsImageValidationComponent,
        GroupAndComponent,
        GroupOrComponent,
        GroupMultipleComponent
    ],
    entryComponents: [
        ValidationPageComponent
    ],
    providers: [],
})
export class ValidationPage {}
