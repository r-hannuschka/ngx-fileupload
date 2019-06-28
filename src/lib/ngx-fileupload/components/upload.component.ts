import { Component, TemplateRef, Input } from '@angular/core';
import { FileUpload } from '../services/file-upload';
import { UploadModel } from '../model/upload';

@Component({
    selector: 'ngx-fileupload',
    styleUrls: ['./upload.component.scss'],
    templateUrl: 'upload.component.html',
})
export class UploadComponent {

    @Input()
    public itemTemplate: TemplateRef<any>;

    @Input()
    public url: string;

    /**
     * all file uploades, which will be added to upload-item view
     */
    public uploads: FileUpload[] = [];

    /**
     * new uploads added with drag and drop
     */
    public onUploadsAdd(uploads: FileUpload[]) {
        this.uploads.push(...uploads);
    }

    public handleUploadChange(upload: UploadModel, fileUpload: FileUpload) {
        /*
        if (response.file.state === UploadState.UPLOADED || response.file.state === UploadState.CANCELED) {
            const uploadListIdx = this.uploads.indexOf(fileUpload);
            this.uploads.splice(uploadListIdx, 1);
        }
        */
    }
}
