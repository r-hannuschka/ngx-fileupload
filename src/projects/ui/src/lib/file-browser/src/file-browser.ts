import { Directive, HostListener, Input, Output, EventEmitter, OnDestroy, Renderer2 } from "@angular/core";
import { Subject } from "rxjs";

/**
 * FileBrowser directive
 *
 * @todo refactor this should only notifiy if files are dropped, not add them to store or create an upload
 *
 * directive to add uploads with drag / drop
 *
 * @example
 *
 * <div [ngxFileUpload]="'URL'" (add)="onUploadAdd($event)"></div>
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
    public add: EventEmitter<File[]>;

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
        private renderer: Renderer2
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

        if (!this.disabled && event.dataTransfer) {
            const files = Array.from(event.dataTransfer.files);
            this.add.emit(files);
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
     * create dummy input field to select files
     * for security reasons, we cant trigger a file select window
     * without it
     */
    private createFieldInputField(): HTMLInputElement {
        const inputField = document.createElement("input");
        this.renderer.setAttribute(inputField, "type", "file");
        this.renderer.setProperty(inputField, "multiple", true);
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

        const files = Array.from(this.fileSelect.files ?? []);
        this.add.emit(files);

        /**
         * clear value otherwise change will not trigger again
         */
        this.fileSelect.files = null;
        this.fileSelect.value = '';
    }
}
