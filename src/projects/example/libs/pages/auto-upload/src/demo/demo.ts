import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgxFileUploadStorage } from "@ngx-file-upload/core";
import * as ExampleCodeData from "projects/example/libs/data/code/auto-upload/auto-upload";

@Component({
    selector: "app-auto-upload-demo",
    templateUrl: "demo.html",
    styleUrls: ["./demo.scss"]
})
export class DemoComponent implements OnInit, OnDestroy {

    public storage: NgxFileUploadStorage;

    public code = ExampleCodeData;

    ngOnInit() {
        this.storage = new NgxFileUploadStorage({
            concurrentUploads: 2,
            autoStart: true
        });
    }

    ngOnDestroy() {
        this.storage.destroy();
    }
}
