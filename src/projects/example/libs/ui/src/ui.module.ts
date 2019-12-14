import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxCustomScrollbarModule } from "ngx-customscrollbar";

import { HeaderComponent } from "./header/header.component";
import { HeaderMenuComponent } from "./header-menu/header-menu.component";
import { RouterModule } from "@angular/router";
import { ButtonComponent } from "./button/button.component";
import { ProgressbarCircleComponent } from "./progressbar-circle/progressbar-circle.component";
import { UploadToolbarComponent } from "./upload-toolbar/upload-toolbar.component";
import { UploadItemSimpleComponent } from "./upload-item-simple/upload-item-simple.component";
import { IgxIconModule, IgxIconService } from "igniteui-angular";
import { UploadOverviewComponent } from "./upload-overview/upload-overview";
import { ProgressbarComponent } from "./progressbar/progressbar";

import * as Icons from "projects/example/libs/data/ui/icons";
import { NgxFileUploadUiModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        IgxIconModule,
        NgxFileUploadUiModule,
        NgxCustomScrollbarModule
    ],
    exports: [
        ButtonComponent,
        HeaderComponent,
        ProgressbarCircleComponent,
        ProgressbarComponent,
        UploadToolbarComponent,
        UploadItemSimpleComponent,
        UploadOverviewComponent,
        NgxCustomScrollbarModule
    ],
    declarations: [
        ButtonComponent,
        HeaderComponent,
        HeaderMenuComponent,
        ProgressbarCircleComponent,
        UploadToolbarComponent,
        UploadItemSimpleComponent,
        UploadOverviewComponent,
        ProgressbarComponent
    ],
    providers: [],
})
export class UiModule {

    public constructor(iconService: IgxIconService) {
        iconService.addSvgIconFromText("github", Icons.GITHUB, "ngx-fileupload-icons");
        iconService.addSvgIconFromText("npm", Icons.NPM, "ngx-fileupload-icons");
    }
}
