import { Component, OnInit, Inject } from "@angular/core";
import { NgxFileUploadStorage, NgxFileUploadFactory, NgxFileUploadOptions, NgxFileUploadRequest } from "@ngx-file-upload/core";
import * as ExampleCodeData from "projects/example/libs/data/code/ngx-dropzone/drop-zone";

@Component({
    selector: "app-ngx-dropzone-demo",
    templateUrl: "./ngx-dropzone.html",
    styleUrls: ["./ngx-dropzone-demo.scss"]
})
export class NgxDropZoneDemoComponent implements OnInit {

    public uploads: NgxFileUploadRequest[] = [];

    public code = ExampleCodeData;

    public storage: NgxFileUploadStorage;

    private uploadOptions: NgxFileUploadOptions;

    constructor(
      @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {
        this.storage = new NgxFileUploadStorage({
          concurrentUploads: 2,
          autoStart: true,
          removeCompleted: 5000 // remove completed after 5 seconds
        });
        this.uploadOptions = {url: "http://localhost:3000/upload"};
    }

    ngOnInit() {
        this.storage.change()
          .subscribe(uploads => this.uploads = uploads);
    }

    public onSelect(event) {
      const addedFiles: File[] = event.addedFiles;
      const uploads = this.uploadFactory.createUploadRequest(addedFiles, this.uploadOptions);
      this.storage.add(uploads);
    }

    public onRemove(upload: NgxFileUploadRequest) {
      this.storage.remove(upload);
    }

    public startUploads() {
      this.storage.startAll();
    }
}
