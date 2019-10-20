
import { Component, Input, ViewChild, TemplateRef, HostListener, OnDestroy, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { UploadRequest, UploadControl } from "../../upload";
import { UploadModel } from "../../../data/upload.model";
import { UploadData } from "../../../data/api";
import {  Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as UploadAPI from "../../../data/api/upload";

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
export class UploadItemComponent implements AfterViewInit, OnDestroy {

    public uploadState = UploadAPI.UploadState;

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
    private fileUpload: UploadRequest;

    /**
     * save subscription here,  since we have only 1 sub
     * i think takeUntil and Subject will be to much so we could
     * unsubscribe directly
     */
    private destroyed: Subject<boolean> = new Subject();

    /**
     * sets upload we want to bind with current view
     */
    @Input()
    public set upload(fileUpload: UploadRequest) {
        this.fileUpload = fileUpload;
        this.context = {
            data: this.fileUpload.data,
            ctrl: new UploadControl(fileUpload)
        };
    }

    @Output()
    public completed: EventEmitter<UploadRequest>;

    @Output()
    public stateChange: EventEmitter<UploadRequest>;

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
    ngAfterViewInit(): void {
        this.fileUpload.change
            .pipe(
                takeUntil(this.destroyed)
            )
            .subscribe({
                next: (upload: UploadModel) => this.context.data = upload.toJson()
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
