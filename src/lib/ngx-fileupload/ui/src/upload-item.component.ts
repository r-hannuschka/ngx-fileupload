
import { Component, OnInit, Input, ViewChild, TemplateRef, HostListener, OnDestroy, Output, EventEmitter } from "@angular/core";
import { FileUpload } from "../../utils/src/http/file-upload";
import { UploadControl } from "../../utils/src/upload-control";
import { UploadModel } from "../../data/upload.model";
import { UploadData, UploadState } from "../../data/api";
import { Subscription } from "rxjs";

export interface FileUploadItemContext {
    data: UploadData;
    ctrl: UploadControl;
}

/**
 * view for upload
 */
@Component({
    selector: "ngx-fileupload-item",
    templateUrl: "upload-item.component.html",
    styleUrls: ["./upload-item.component.scss"],
})
export class UploadItemComponent implements OnInit, OnDestroy {

    /**
     * item template which should rendered to display upload data
     */
    public itemTpl: TemplateRef<FileUploadItemContext>;

    /**
     * template context which is bound to rendered template
     */
    public context: FileUploadItemContext;

    /**
     * file upload which should bound to this view
     */
    private fileUpload: FileUpload;

    /**
     * save subscription here,  since we have only 1 sub
     * i think takeUntil and Subject will be to much so we could
     * unsubscribe directly
     */
    private changeSub: Subscription;

    /**
     * sets upload we want to bind with current view
     */
    @Input()
    public set upload(fileUpload: FileUpload) {
        this.fileUpload = fileUpload;
        this.context = {
            data: null,
            ctrl: new UploadControl(fileUpload)
        };
    }

    @Output()
    public completed: EventEmitter<FileUpload>;

    @Output()
    public stateChange: EventEmitter<FileUpload>;

    public constructor() {
        this.completed   = new EventEmitter();
        this.stateChange = new EventEmitter();
    }

    /**
     * set template which should be used for upload items, if no TemplateRef is passed
     * it will fallback to [defaultUploadItem]{@link #template}
     */
    @ViewChild("defaultUploadItem", {static: true})
    @Input()
    public set template(tpl: TemplateRef<FileUploadItemContext>) {
        if (tpl instanceof TemplateRef) {
            this.itemTpl = tpl;
        }
    }

    /**
     * ensure all click events will canceled
     * so we dont affect anything other
     */
    @HostListener("click", ["$event"])
    public onItemClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    /**
     * register on upload change event to get current informations from upload
     * and pass to template context to render them
     *
     * @inheritdoc
     */
    ngOnInit(): void {

        let state: UploadState = UploadState.QUEUED;

        this.changeSub = this.fileUpload.change
            .subscribe({
                next: (upload: UploadModel) => {
                    this.context.data = upload.toJson();

                    if (state !== upload.state) {
                        this.stateChange.emit(this.fileUpload);
                        state = upload.state;
                    }
                },
                complete: () => {
                    this.completed.emit(this.fileUpload);
                }
            });
    }

    /**
     * if component gets destroyed remove change subscription
     */
    ngOnDestroy() {
        // cancel file upload if item view is destroyed
        this.changeSub.unsubscribe();
        this.changeSub = null;
    }

    /**
     * just to disable sort for keyvalue pipe
     */
    public returnZero() {
        return 0;
    }
}
