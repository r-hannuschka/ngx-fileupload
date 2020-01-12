import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { HeaderComponent } from "./header/header.component";
import { HeaderMenuComponent } from "./header-menu/header-menu.component";
import { RouterModule } from "@angular/router";
import { ButtonComponent } from "./button/button.component";
import { UploadToolbarComponent } from "./upload-toolbar/upload-toolbar.component";
import { IgxIconModule, IgxIconService } from "igniteui-angular";

import * as Icons from "projects/example/libs/data/ui/icons";
import { NgxFileUploadUiModule } from "@ngx-file-upload/ui";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        IgxIconModule,
        NgxFileUploadUiModule,
    ],
    exports: [
        ButtonComponent,
        HeaderComponent,
        UploadToolbarComponent,
    ],
    declarations: [
        ButtonComponent,
        HeaderComponent,
        HeaderMenuComponent,
        UploadToolbarComponent,
    ],
    providers: [],
})
export class UiModule {

    public constructor(iconService: IgxIconService) {
        iconService.addSvgIconFromText("github", Icons.GITHUB, "ngx-fileupload-icons");
        iconService.addSvgIconFromText("npm", Icons.NPM, "ngx-fileupload-icons");
    }
}
