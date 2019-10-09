import { Component } from "@angular/core";
import { environment } from "../environments/environment";
import { MenuItem, MainMenuItems } from "@ngx-fileupload-example/data/base/data";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    title = "ngx-fileupload";

    public disableAnimations = false;

    public menuItems: MenuItem[] = MainMenuItems;

    constructor() {
        this.disableAnimations = environment.disableAnimations || false;
    }
}
