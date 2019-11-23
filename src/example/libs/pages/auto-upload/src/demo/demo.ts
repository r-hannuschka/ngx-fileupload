import { Component, OnInit, OnDestroy } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";
import * as ExampleCodeData from "@ngx-fileupload-example/data/code/auto-upload/auto-upload";

@Component({
    selector: "app-auto-upload-demo",
    templateUrl: "demo.html",
    styleUrls: ["./demo.scss"]
})
export class DemoComponent implements OnInit, OnDestroy {

    public storage: UploadStorage;

    public code = ExampleCodeData;

    ngOnInit() {
        this.storage = new UploadStorage({
            concurrentUploads: 2,
            enableAutoStart: true
        });
    }

    ngOnDestroy() {
        this.storage.destroy();
    }
}
