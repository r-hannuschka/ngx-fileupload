export const TS = `
import { Component, OnInit } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-auto-upload-demo",
    templateUrl: "demo.html",
    styleUrls: ["./demo.scss"]
})
export class DemoComponent implements OnInit, OnDestroy {

    public storage: UploadStorage;

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
`;

export const HTML = `
<ngx-fileupload [url]="'http://localhost:3000/upload'" [storage]="storage"></ngx-fileupload>
`;
