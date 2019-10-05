import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { HeaderMenuComponent } from "./header-menu/header-menu.component";
import { RouterModule } from "@angular/router";
import { ButtonComponent } from "./button/button.component";
import { ProgressbarCircleComponent } from "./progressbar-circle/progressbar-circle.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        ButtonComponent,
        HeaderComponent,
        ProgressbarCircleComponent
    ],
    declarations: [
        ButtonComponent,
        HeaderComponent,
        HeaderMenuComponent,
        ProgressbarCircleComponent
    ],
    providers: [],
})
export class UiModule { }
