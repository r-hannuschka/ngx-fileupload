import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgMathPipesModule } from "angular-pipes";

import { UploadViewComponent, UploadFileDirective, UploadItemComponent } from "@lib/ui";
import { ToArrayPipe } from "./utils/to-array.pipe";

@NgModule({
    declarations: [
        UploadFileDirective,
        UploadItemComponent,
        UploadViewComponent,
        ToArrayPipe,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        NgMathPipesModule
    ],
    exports: [
        UploadFileDirective,
        UploadItemComponent,
        UploadViewComponent,
        ToArrayPipe
    ]
})
export class NgxFileUploadModule {}
