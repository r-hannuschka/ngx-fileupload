import { Component, OnInit, Input } from "@angular/core";
import { MenuItem } from "@ngx-fileupload-example/data";

@Component({
    selector: "app-ui--header",
    templateUrl: "header.component.html"
})
export class HeaderComponent implements OnInit {
    constructor() { }

    @Input()
    menuItems: MenuItem[] = [];

    ngOnInit() { }
}
