
import { Component, OnInit, Input, ViewChild, TemplateRef, EventEmitter, Output, HostListener, OnDestroy } from "@angular/core";
import { FileUpload } from "../services/file-upload";
import { UploadControl } from "../services/upload-control";
import { UploadModel, UploadData, UploadState } from "../model/upload";
import { Subscription } from "rxjs";
import { Upload } from "../api/upload";

export interface FileUploadItemContext {
    data: UploadData;
    ctrl: UploadControl;
}

/**
 * view for upload
 */
@Component({
    selector: "ngx-fileupload-item",
    templateUrl: "ngx-fileupload-item.component.html",
    styleUrls: ["./ngx-fileupload-item.component.scss"],
})
export class NgxFileUploadItemComponent implements OnInit, OnDestroy {

    /**
     * item template which should rendered to display upload data
     */
    public itemTpl: TemplateRef<FileUploadItemContext>;

    /**
     * emit event if upload state has been changed
     */
    @Output()
    public changed: EventEmitter<Upload> = new EventEmitter();

    /**
     * emit event if upload state has been changed
     */
    @Output()
    public completed: EventEmitter<Upload> = new EventEmitter();

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
     * register on upload change event to get current informations from upload
     * and pass to template context to render them
     *
     * @inheritdoc
     */
    ngOnInit(): void {
        this.changeSub = this.fileUpload.change
            .subscribe({
                next: (upload: UploadModel) => {
                    this.context.data = upload.toJson();

                    this.changed.emit(this.fileUpload);

                    if (upload.state === UploadState.CANCELED || upload.state === UploadState.UPLOADED) {
                        this.completed.emit(this.fileUpload);
                    }
                }
            });
    }

    /**
     * if component gets destroyed remove change subscription
     */
    ngOnDestroy() {
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
