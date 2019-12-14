import { Component, OnInit, Input } from "@angular/core";
import { MenuItem } from "projects/example/libs/data/base/data";

@Component({
    selector: "app-ui--header-menu",
    templateUrl: "header-menu.component.html",
    styleUrls: ["./header-menu.component.scss"]
})
export class HeaderMenuComponent implements OnInit {
    constructor() { }

    @Input()
    public items: MenuItem[];

    ngOnInit() { }
}
