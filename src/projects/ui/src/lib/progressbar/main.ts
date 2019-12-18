import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ProgressbarComponent } from './src/progressbar';
import { ProgressbarCircleComponent } from "./src/progressbar-circle";

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
