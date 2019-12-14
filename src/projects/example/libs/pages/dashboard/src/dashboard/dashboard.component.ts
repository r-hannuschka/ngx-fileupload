import { Component, OnInit, Inject } from "@angular/core";
import { UploadStorage } from "@ngx-file-upload/core";
import { ExampleUploadStorage } from "projects/example/libs/data/base/upload-storage";

@Component({
    selector: "app-dashboard",
    templateUrl: "dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {

    constructor(
        @Inject(ExampleUploadStorage) public storage: UploadStorage
    ) { }

    ngOnInit() { }
}
