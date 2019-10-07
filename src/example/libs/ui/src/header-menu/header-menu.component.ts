import { Component, OnInit, Input } from "@angular/core";
import { MenuItem } from "@ngx-fileupload-example/data/base/data";

@Component({
    selector: "app-ui--header-menu",
    templateUrl: "header-menu.component.html"
})
export class HeaderMenuComponent implements OnInit {
    constructor() { }

    @Input()
    public items: MenuItem[];

    ngOnInit() { }
}
