import { Directive, HostListener, Input, Output, EventEmitter, OnDestroy, Renderer2, Inject } from "@angular/core";
import { Subject } from "rxjs";

import { Validator, ValidationFn } from "../../../data/api/validation";
import { UploadRequest, UploadOptions, UploadStorage } from "../../upload";
import { NgxFileUploadFactory } from "../../utils";

/**
 * FileBrowser directive
 *
 * @todo refactor this should only notifiy if files are dropped, not add them to store or create an upload
 *
 * directive to add uploads with drag / drop
 *
 * @example
 *
 * <div [ngxFileUpload]="'URL'" (add)="onUploadAdd($event)" #ngxFileuploadRef="ngxFileUploadRef"></div>
 * <button (click)="ngxFileUploadRef.upload()">Upload</button>
 */
@Directive({
  selector: "ngxFileUpload, [ngxFileUpload]"
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

    /**
     *
     * @deprecated
     * @todo remove in 3.3.0
     */
    @Input()
    public storage: UploadStorage;

    /**
     * this should be only a file browser directive
     *
     * @deprecated
     * @todo remove in 3.3.0
     */
    @Input("ngxFileUpload")
    public set ngxFileUpload(url: string) {
        this.url = url;
    }

    /**
     *
     * @deprecated
     * @todo remove in 3.3.0
     */
    @Input()
    public url = "";

    /**
     * if set to false upload post request body will use
     * plain file object in body
     *
     * @deprecated
     * @todo remove in 3.3.0
     */
    @Input()
    public useFormData = true;

    /**
     * form data field name with which form >data will be send
     * by default this will be file
     *
     * @deprecated
     * @todo remove in 3.3.0
     */
    @Input()
    public formDataName = "file";

    /**
     * form data field name with which form >data will be send
     * by default this will be file
     *
     * @deprecated
     * @todo remove in 3.3.0
     */
    @Input()
    public validator: Validator | ValidationFn = null;

    @Input()
    public disabled = false;

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
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
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
     *
     * @todo refactor this directive should only select
     * files and not push them into any store.
     */
    private handleFileSelect(files: File[]) {

        const uploadOptions: UploadOptions = {
            url: this.url,
            formData: {
                enabled: this.useFormData,
                name: this.formDataName
            }
        };

        files.forEach((file: File) => {
            const upload = this.uploadFactory.createUploadRequest(file, uploadOptions, this.validator);
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
