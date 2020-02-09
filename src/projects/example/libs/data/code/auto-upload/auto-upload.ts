export const TS = `
import { Component, OnInit } from "@angular/core";
import { NgxFileUploadStorage } from "@ngx-file-upload/core";

@Component({
    selector: "app-auto-upload-demo",
    templateUrl: "demo.html",
    styleUrls: ["./demo.scss"]
})
export class DemoComponent implements OnInit, OnDestroy {

    public storage: NgxFileUploadStorage;

    ngOnInit() {
        this.storage = new NgxFileUploadStorage({
            concurrentUploads: 2,
            enableAutoStart: true
        });
    }

    ngOnDestroy() {
        this.storage.destroy();
    }
}
`;

export const HTML = `
<ngx-fileupload [url]="'http://localhost:3000/upload'" [storage]="storage"></ngx-fileupload>
`;
