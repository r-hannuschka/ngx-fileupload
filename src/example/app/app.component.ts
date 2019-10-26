import { Component, OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { MenuItem, MainMenuItems } from "@ngx-fileupload-example/data/base/data";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    title = "ngx-fileupload";

    public disableAnimations = false;

    public menuItems: MenuItem[] = MainMenuItems;

    public showUploadOverlay = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.disableAnimations = environment.disableAnimations || false;
    }

    public ngOnInit() {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe({
                next: (event: NavigationEnd) => {
                    this.showUploadOverlay = this.activatedRoute.snapshot.firstChild.data.uploadOverlay || false;
                }
            });
    }
}
