
import { Component, OnInit, AfterViewInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FileState, FileModel } from '../model/file';
import { FileUpload } from '../services/file-upload';

export interface FileContext {
    state: FileState;
    uploaded: number;
    size: number;
    name: string;
}

@Component({
    selector: 'ngx-fileupload-item',
    templateUrl: 'upload-item.component.html'
})
export class UploadItemComponent implements OnInit, AfterViewInit {

    public itemTpl: TemplateRef<any>;

    public context: {file: FileContext};

    private fileUpload: FileUpload;

    public constructor() {
    }

    @Input()
    public set upload(fileUpload: FileUpload) {
        this.fileUpload = fileUpload;

        const fileContext: FileContext = {
            state    : this.fileUpload.file.state,
            uploaded : this.fileUpload.file.uploaded,
            size     : this.fileUpload.file.fileSize,
            name     : this.fileUpload.file.fileName
        };

        this.context = {
            file: fileContext
        };
    }

    @ViewChild('defaultUploadItem', {static: true})
    @Input()
    public set template(tpl: TemplateRef<any>) {
        this.itemTpl = tpl || this.itemTpl;
    }

    ngOnInit(): void {
        this.fileUpload.change.subscribe({
            next: (file: FileModel) => {
                this.context.file.state = file.state;
                this.context.file.uploaded = file.uploaded;
            }
        });
    }

    ngAfterViewInit() {
        window.setTimeout(() => {
            this.fileUpload.start();
        }, 0);
    }
}
