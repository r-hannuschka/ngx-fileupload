import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileModel } from '../model/file';
import { FileUpload } from '../services/file-upload';

@Directive({
  selector: '[ngxFileupload]'
})
export class NgxFileuploadDirective {

    @Input('ngxFileupload')
    public url: string;

    @Output()
    public addUploads: EventEmitter<FileUpload[]>;

    constructor(
        private httpClient: HttpClient
    ) {
        this.addUploads = new EventEmitter();
    }

    @HostListener('dragover', ['$event'])
    public onFileDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('drop', ['$event'])
    public onFileDrop(event: DragEvent) {
        event.preventDefault();

        const files   = Array.from(event.dataTransfer.files);

        // convert upload files to file uploads
        const uploads = files.map((file) => {
            const fileModel  = new FileModel(file);
            return new FileUpload(this.httpClient, fileModel, this.url);
        });

        this.addUploads.emit(uploads);
    }
}
