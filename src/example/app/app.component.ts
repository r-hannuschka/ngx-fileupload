import { Component, OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { MaxUploadSizeValidator } from "./validators/max-size.validator";
import { OnlyZipValidator } from "./validators/only-zip.validator";
import { ImageValidator } from "./validators/image.validator";
import { Validator, ValidationBuilder } from "lib/public-api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    title = "ngx-fileupload";

    public disableAnimations = false;

    public validator: Validator;

    constructor() {
        this.disableAnimations = environment.disableAnimations || false;
    }

    public ngOnInit() {
        this.validator = ValidationBuilder.and(
            ValidationBuilder.or(new OnlyZipValidator(), new ImageValidator()),
            new MaxUploadSizeValidator()
        );
    }
}
