import { Component, OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { MenuItem } from "@ngx-fileupload-example/data/base/data";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    title = "ngx-fileupload";

    public disableAnimations = false;

    public menuItems: MenuItem[];

    constructor() {
        this.disableAnimations = environment.disableAnimations || false;
    }

    public ngOnInit() {
        this.menuItems = [
            {label: "Home", route: "dashboard"},
            {label: "Item Template", route: "item-template" },
        ];
    }
}
