import { Directive, HostListener, Input, Output, EventEmitter, OnDestroy, Renderer2 } from "@angular/core";
import { Subject } from "rxjs";

import { Validator, ValidationFn } from "../../../data/api/validation";
import { UploadRequest } from "../../upload/src/upload.request";
import { FileUploadFactory } from "../../utils/factory";
import { UploadStorage } from "../../upload/src/upload.storage";

/**
 * directive to add uploads with drag / drop
 *
 * @example
 *
 * <div [ngxFileUpload]="'URL'" (add)="onUploadAdd($event)" #ngxFileuploadRef="ngxFileUploadRef"></div>
 * <button (click)="ngxFileUploadRef.upload()">Upload</button>
 */
@Directive({
  selector: "[ngxFileUpload]"
})
export class FileBrowserDirective implements OnDestroy {

    /**
     * upload has been added
     *
     * @example
     *
     * <div [ngxFileUpload]=""localhost/upload"" (add)="onUploadAdd($event)" ></div>
     */
    @Output()
    public add: EventEmitter<UploadRequest[]>;

    @Input()
    public storage: UploadStorage;

    @Input("ngxFileUpload")
    public set ngxFileUpload(url: string) {
        this.url = url;
    }

    @Input()
    public validator: Validator | ValidationFn;

    /**
     * if set to false upload post request body will use
     * plain file object in body
     */
    @Input()
    public useFormData = true;

    /**
     * form data field name with which form >data will be send
     * by default this will be file
     */
    @Input()
    public formDataName = "file";

    @Input()
    public disabled = false;

    private url: string;

    /**
     * remove from subscribtions if component gets destroyed
     */
    private destroyed$: Subject<boolean> = new Subject();

    /**
     * input file field to trigger file window
     */
    private fileSelect: HTMLInputElement;

    /**
     * Creates an instance of NgxFileUploadDirective.
     */
    constructor(
        private renderer: Renderer2,
        private uploadFactory: FileUploadFactory,
    ) {
        this.add = new EventEmitter();
        this.fileSelect = this.createFieldInputField();
    }

    /**
     * directive gets destroyed
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * handle drag over event
     */
    @HostListener("dragover", ["$event"])
    public onFileDragOver(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * handle drop event
     */
    @HostListener("drop", ["$event"])
    public onFileDrop(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();

        if (!this.disabled) {
            const files = Array.from(event.dataTransfer.files);
            this.handleFileSelect(files);
        }
    }

    /**
     * add click host listener
     * to get notified we have a click event
     */
    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent) {

        event.stopPropagation();
        event.preventDefault();

        if (!this.disabled) {
            this.fileSelect.click();
        }
    }

    /**
     * files has been selected via drag drop
     * or with input type="file"
     */
    private handleFileSelect(files: File[]) {
        files.forEach((file: File) => {
            const upload = this.uploadFactory.createUpload(file, {url: this.url});
            if (this.validator) {
                upload.validate(this.validator);
            }
            this.storage.add(upload);
        });
    }

    /**
     * create dummy input field to select files
     * for security reasons, we cant trigger a file select window
     * without it
     */
    private createFieldInputField(): HTMLInputElement {
        const inputField = document.createElement("input");
        this.renderer.setAttribute(inputField, "type", "file");
        this.renderer.setAttribute(inputField, "multiple", "multiple");
        this.renderer.setStyle(inputField, "display", "none");
        this.renderer.listen(inputField, "change", (e) => this.onFileSelect(e));
        return inputField;
    }

    /**
     * register on change event on input[type="file"] field
     * and create the uploads
     */
    private onFileSelect(event: Event) {
        event.stopPropagation();
        event.preventDefault();

        const files = Array.from(this.fileSelect.files);
        this.handleFileSelect(files);

        /**
         * clear value otherwise change will not trigger again
         */
        this.fileSelect.value = null;
        this.fileSelect.files = null;
    }
}
