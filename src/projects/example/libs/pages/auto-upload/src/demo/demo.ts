import { Component, OnDestroy } from "@angular/core";
import { NgxFileUploadStorage } from "@ngx-file-upload/core";
import * as ExampleCodeData from "projects/example/libs/data/code/auto-upload/auto-upload";

@Component({
    selector: "app-auto-upload-demo",
    templateUrl: "demo.html",
    styleUrls: ["./demo.scss"]
})
export class DemoComponent implements OnDestroy {

    public storage: NgxFileUploadStorage = new NgxFileUploadStorage({
        concurrentUploads: 2,
        autoStart: true
    });

    public code = ExampleCodeData;

    ngOnDestroy() {
        this.storage.destroy();
    }
}
