
import { Component, OnInit, Input, ViewChild, TemplateRef, EventEmitter, Output, HostListener } from "@angular/core";
import { FileUpload } from "../services/file-upload";
import { UploadControl } from "../services/upload-control";
import { UploadModel, UploadData } from "../model/upload";

export interface UploadContext {
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
export class UploadItemComponent implements OnInit {

    /**
     * item template which should used to render upload data
     */
    public itemTpl: TemplateRef<UploadContext>;

    /**
     * upload state has been changed
     */
    @Output()
    public changed: EventEmitter<UploadModel> = new EventEmitter();

    /**
     * template context which is bound to rendered template
     */
    public context: UploadContext;

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
     * sets template which should used to render file data
     */
    @ViewChild("defaultUploadItem", {static: true})
    @Input()
    public set template(tpl: TemplateRef<any>) {
        this.itemTpl = tpl || this.itemTpl;
    }

    /**
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
