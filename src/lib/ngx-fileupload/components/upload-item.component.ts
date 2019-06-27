
import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FileUpload, FileData } from '../services/file-upload';
import { UploadControl } from '../services/upload-control';

/**
 * view for upload
 */
@Component({
    selector: 'ngx-fileupload-item',
    templateUrl: 'upload-item.component.html',
    styleUrls: ['./upload-item.component.scss']
})
export class UploadItemComponent implements OnInit {

    /**
     * item template which should used to render upload data
     */
    public itemTpl: TemplateRef<any>;

    /**
     * template context which is bound to rendered template
     */
    public context: {
        file: FileData,
        ctrl: UploadControl
    };

    /**
     * file upload which should bound to this view
     */
    private fileUpload: FileUpload;

    /**
     * sets upload we want to bind with current view
     */
    @Input()
    public set upload(fileUpload: FileUpload) {
        this.fileUpload = fileUpload;
        const fileContext: FileData = this.fileUpload.toJson();
        this.context = {
            file: fileContext,
            ctrl: new UploadControl(fileUpload)
        };
    }

    /**
     * sets template which should used to render file data
     */
    @ViewChild('defaultUploadItem', {static: true})
    @Input()
    public set template(tpl: TemplateRef<any>) {
        this.itemTpl = tpl || this.itemTpl;
    }

    /**
     * @inheritdoc
     */
    ngOnInit(): void {
        this.fileUpload.change
            .subscribe({
                next: () => {
                    this.context.file = this.fileUpload.toJson();
                },
                complete: () => {
                }
            });
    }
}
