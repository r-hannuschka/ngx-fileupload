import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarComponent } from "./ui/progressbar";
import { ProgressbarCircleComponent } from "./ui/progressbar-circle";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ProgressbarComponent,
        ProgressbarCircleComponent
    ],
    declarations: [
        ProgressbarComponent,
        ProgressbarCircleComponent
    ],
    providers: [],
})
export class NgxFileUploadUiProgressbarModule { }
