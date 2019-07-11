import { Component, OnInit } from "@angular/core";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "ngx-fileupload";

  public disableAnimations = false;

  constructor() {
    this.disableAnimations = environment.disableAnimations || false;
  }
}
