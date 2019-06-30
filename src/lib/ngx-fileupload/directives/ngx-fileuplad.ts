import { Directive, HostListener, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadModel } from '../model/upload';
import { FileUpload } from '../services/file-upload';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/**
 * directive to add uploads with drag / drop
 *
 * @example
 *
 * <div [ngxFileupload]="'URL'" (add)="onUploadAdd($event)" #fileUpload='fileupload'></div>
 */
@Directive({
  selector: '[ngxFileupload]',
  exportAs: 'ngxFileuploadRef'
})
export class NgxFileuploadDirective implements OnDestroy {

    /**
     * upload file queue
     */
    private uploads: FileUpload[] = [];

    /**
     * remove from subscribtions if component gets destroyed
     */
    private destroyed$: Subject<boolean> = new Subject();

    @Input('ngxFileupload')
    public url: string;

    @Output()
    public add: EventEmitter<FileUpload[]>;

    constructor(
        private httpClient: HttpClient
    ) {
        this.add = new EventEmitter();
    }

    /**
     * handle drag over event
     */
    @HostListener('dragover', ['$event'])
    public onFileDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * handle drop event
     */
    @HostListener('drop', ['$event'])
    public onFileDrop(event: DragEvent) {

        event.stopPropagation();
        event.preventDefault();

        const files   = Array.from(event.dataTransfer.files);
        const uploads = files.map((file) => this.createUpload(file));
        this.add.emit(uploads);
    }

    /**
     * directive gets destroyed
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.uploads = [];
        this.destroyed$.complete();
    }

    /**
     * begin all uploads at once
     */
    public upload() {
        this.uploads.forEach((upload: FileUpload) => upload.start());
    }

    /**
     * cancel all downloads at once, start from end since the upload
     * completes we it will removed from uploads array which changes the index.
     * if the last elment will removed we dont care since we go into the other direction
     */
    public cancel() {
        for ( let i = this.uploads.length - 1; i >= 0; i --) {
            this.uploads[i].cancel();
        }
    }

    /**
     * create upload from file, listen to complete
     * to remove upload from uploads list
     *
     * remove uplaod from uploads repository if upload completed
     * or canceled
     */
    private createUpload(file: File): FileUpload {

        const fileModel = new UploadModel(file);
        const upload    = new FileUpload(this.httpClient, fileModel, this.url);
        this.uploads.push(upload);

        const sub = upload.change
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                complete: () => {
                    this.uploads.splice(this.uploads.indexOf(upload), 1);
                    sub.unsubscribe();
                }
            });

        return upload;
    }
}
