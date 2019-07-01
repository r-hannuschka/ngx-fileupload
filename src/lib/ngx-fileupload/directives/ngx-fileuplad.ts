import { Directive, HostListener, Input, Output, EventEmitter, OnDestroy, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadModel, UploadState } from '../model/upload';
import { FileUpload } from '../services/file-upload';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NGX_FILEUPLOAD_VALIDATOR, NgxFileuploadValidator } from '../services/validation';

/**
 * directive to add uploads with drag / drop
 *
 * @example
 *
 * <div [ngxFileupload]="'URL'" (add)="onUploadAdd($event)" #myNgxFileuploadRef='ngxFileuploadRef'></div>
 * <button (click)="myNgxFileuploadRef.upload()">Upload</button>
 */
@Directive({
  selector: '[ngxFileupload]',
  exportAs: 'ngxFileuploadRef'
})
export class NgxFileuploadDirective implements OnDestroy {

    /**
     * upload has been added
     *
     * @example
     *
     * <div [ngxFileupload]="'localhost/upload'" (add)="onUploadAdd($event)" ></div>
     */
    @Output()
    public add: EventEmitter<FileUpload[]>;

    /**
     * url which should be used as endpoint for the file upload
     * this field is mandatory
     *
     * @example
     * <div [ngxFileupload]="'localhost/upload'" (add)="onUploadAdd($event)" ></div>
     */
    @Input('ngxFileupload')
    public url: string;

    /**
     * remove from subscribtions if component gets destroyed
     */
    private destroyed$: Subject<boolean> = new Subject();

    /**
     * upload file queue
     */
    private uploads: FileUpload[] = [];

    private validators: NgxFileuploadValidator[] = [];

    /**
     * Creates an instance of NgxFileuploadDirective.
     */
    constructor(
        private httpClient: HttpClient,
        @Optional()
        @Inject(NGX_FILEUPLOAD_VALIDATOR)
        validation: NgxFileuploadValidator | NgxFileuploadValidator[]
    ) {
        if (validation) {
            this.validators = Array.isArray(validation) ? validation : [validation];
        }
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
    public uploadAll() {
        this.uploads.forEach((upload: FileUpload) => upload.start());
    }

    /**
     * cancel all downloads at once
     */
    public cancelAll() {
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
        const upload = new FileUpload(this.httpClient, fileModel, this.url);

        this.preValidateUpload(fileModel);
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

    /**
     * pre validate upload, if validation result is invalid
     * fill could not uploaded anymore
     */
    private preValidateUpload(upload: UploadModel) {

        for (let i = 0, ln = this.validators.length; i < ln; i++) {
            const validator = this.validators[i];
            const result = validator.validate(upload.file);

            upload.isValid = result.valid;
            upload.message = !result.valid ? result.error : '';

            if (!upload.isValid) {
                upload.state   = UploadState.INVALID;
                break;
            }
        }
    }
}
