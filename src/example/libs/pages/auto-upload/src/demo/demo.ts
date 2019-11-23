import { Component, OnInit } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-dashboard",
    templateUrl: "demo.html",
    styleUrls: ["./demo.scss"]
})
export class DemoComponent implements OnInit {

    public storage: UploadStorage;

    ngOnInit() {
        this.storage = new UploadStorage({
            concurrentUploads: 2,
            enableAutoStart: true
        });
    }
}
