import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgMathPipesModule } from "angular-pipes";

import { NgxFileUploadItemComponent } from "./components/ngx-fileupload-item.component";
import { NgxFileUploadDirective } from "./directives/ngx-fileuplad";
import { NgxFileUploadComponent } from "./components/ngx-fileupload.component";

@NgModule({
    declarations: [
        NgxFileUploadDirective,
        NgxFileUploadItemComponent,
        NgxFileUploadComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgMathPipesModule
    ],
    exports: [
        NgxFileUploadDirective,
        NgxFileUploadItemComponent,
        NgxFileUploadComponent
    ]
})
export class NgxFileUploadModule {}
