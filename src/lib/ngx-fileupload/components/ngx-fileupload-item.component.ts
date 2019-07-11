
import { Component, OnInit, Input, ViewChild, TemplateRef, EventEmitter, Output, HostListener } from "@angular/core";
import { FileUpload } from "../services/file-upload";
import { UploadControl } from "../services/upload-control";
import { UploadModel, UploadData } from "../model/upload";

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
export class NgxFileUploadItemComponent implements OnInit {

    /**
     * item template which should rendered to display upload data
     */
    public itemTpl: TemplateRef<FileUploadItemContext>;

    /**
     * emit event if upload state has been changed
     */
    @Output()
    public changed: EventEmitter<UploadModel> = new EventEmitter();

    /**
     * template context which is bound to rendered template
     */
    public context: FileUploadItemContext;

    /**
     * file upload which should bound to this view
     */
    private fileUpload: FileUpload;

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
    }

    /**
     * set template which should be used for upload items, if nothing is passed
     * it [defaultUploadItem]{@link #template} template will be used
     */
    @ViewChild("defaultUploadItem", {static: true})
    @Input()
    public set template(tpl: TemplateRef<FileUploadItemContext>) {
        if (tpl !== undefined) {
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
        this.fileUpload.change.subscribe({
            next: (upload: UploadModel) => {
                this.context.data = upload.toJson();
                this.changed.emit(upload);
            }
        });
    }
}
