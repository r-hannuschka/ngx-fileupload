import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgMathPipesModule } from "angular-pipes";

import { UploadViewComponent, UploadFileDirective, UploadItemComponent } from "@lib/ui";

@NgModule({
    declarations: [
        UploadFileDirective,
        UploadItemComponent,
        UploadViewComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        NgMathPipesModule
    ],
    exports: [
        UploadFileDirective,
        UploadItemComponent,
        UploadViewComponent
    ]
})
export class NgxFileUploadModule {}
