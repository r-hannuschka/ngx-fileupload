import { Component, TemplateRef, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FileUpload } from '../services/file-upload';
import { UploadModel, UploadState } from '../model/upload';
import { of } from 'rxjs';
import { take, delay, map } from 'rxjs/operators';

@Component({
    selector: 'ngx-fileupload',
    styleUrls: ['./upload.component.scss'],
    templateUrl: 'upload.component.html',
    animations: [
        trigger('removeUpload', [
            state('visible', style({opacity: 1})),
            transition( ':leave', [
                animate(250, style({opacity: 0}))
            ])
        ])
    ],
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

    /**
     * handle upload change event
     * but only listen to uploaded or canceld to remove upload
     */
    public handleUploadChange(upload: UploadModel, fileUpload: FileUpload) {
        if (upload.state === UploadState.UPLOADED || upload.state === UploadState.CANCELED) {
            of(null).pipe( delay(500), take(1))
            .subscribe({complete: () => {
                const idx = this.uploads.indexOf(fileUpload);
                this.uploads.splice(idx, 1);
            }});
        }
    }
}
