import { Component, OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { MenuItem } from "@ngx-fileupload-example/data/base/data";
import { IgxIconService } from "igniteui-angular";
import * as Icons from "@ngx-fileupload-example/data/base/icons";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    title = "ngx-fileupload";

    public disableAnimations = false;

    public menuItems: MenuItem[];

    constructor(private igxIconService: IgxIconService) {
        this.disableAnimations = environment.disableAnimations || false;
    }

    public ngOnInit() {

        this.igxIconService.addSvgIconFromText("typescript", Icons.tsLogo, "ngxFileUploadDemoIcons");
        this.igxIconService.addSvgIconFromText("html5", Icons.html5Icon, "ngxFileUploadDemoIcons");

        this.menuItems = [
            {label: "Home", route: "dashboard"},
            {label: "Item Template", route: "item-template" },
        ];
    }
}
