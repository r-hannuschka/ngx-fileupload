
import { Component, Input, ViewChild, TemplateRef, HostListener, OnDestroy, AfterViewInit } from "@angular/core";
import { UploadRequest, UploadState, UploadRequestData, UploadControl } from "@ngx-file-upload/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Control } from "./upload.control";

export interface FileUploadItemContext {
    data: UploadRequestData;
    ctrl: UploadControl;
}

/**
 * view for upload
 */
@Component({
    selector: "ngx-file-upload-ui--item",
    templateUrl: "upload-item.html",
    styleUrls: ["./upload-item.scss"],
})
export class UploadItemComponent implements AfterViewInit, OnDestroy {

    public uploadState = UploadState;

    /**
     * template context which is bound to rendered template
     */
    public context: FileUploadItemContext;

    /**
     * file upload which should bound to this view
     */
    private fileUpload: UploadRequest;

    /**
     * save subscription here,  since we have only 1 sub
     * i think takeUntil and Subject will be to much so we could
     * unsubscribe directly
     */
    private destroyed: Subject<boolean> = new Subject();

    /**
     * set template which should be used for upload items, if no TemplateRef is passed
     * it will fallback to [defaultUploadItem]{@link #template}
     */
    @ViewChild("defaultUploadItem", {static: true})
    public itemTpl: TemplateRef<FileUploadItemContext>;

    @Input()
    public set template(tpl: TemplateRef<FileUploadItemContext>) {
        if (tpl instanceof TemplateRef) {
            this.itemTpl = tpl;
        }
    }

    /**
     * sets upload we want to bind with current view
     */
    @Input()
    public set upload(request: UploadRequest) {
        this.fileUpload = request;
        this.context = {
            data: {...request.data},
            ctrl: new Control(request)
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
     * register on upload change event to get current informations from upload
     * and pass to template context to render them
     *
     * @inheritdoc
     */
    ngAfterViewInit(): void {
        this.fileUpload.change
            .pipe(takeUntil(this.destroyed))
            .subscribe({
                next: (fileUpload: UploadRequestData) => {
                    return this.context.data = fileUpload;
                }
            });
    }

    /**
     * if component gets destroyed remove change subscription
     */
    ngOnDestroy() {
        this.destroyed.next(true);
    }

    /**
     * just to disable sort for keyvalue pipe
     */
    public returnZero() {
        return 0;
    }
}
