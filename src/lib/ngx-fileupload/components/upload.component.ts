import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FileUpload } from '../services/file-upload';

@Component({
    selector: 'ngx-fileupload',
    templateUrl: 'upload.component.html'
})
export class UploadComponent {

    public itemTpl: TemplateRef<any>;

    public items: FileUpload[] = [];

    @ViewChild('defaultUploadItem', { static: true})
    @Input()
    public set itemTemplate(tpl: TemplateRef<any>) {
        this.itemTpl = tpl || this.itemTpl;
    }
}
