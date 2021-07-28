
import { Component, Input, ViewChild, TemplateRef, HostListener, OnDestroy, AfterViewInit, OnInit } from "@angular/core";
import { NgxFileUploadRequest, NgxFileUploadState, NgxFileUploadControl, INgxFileUploadRequestData } from "@ngx-file-upload/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Control } from "./upload.control";
import { NgxFileUploadUiI18nProvider, NgxFileUploadUiI18nItem, NgxFileUploadUiI18nKey } from "../../i18n";

export interface FileUploadItemContext {
  data: INgxFileUploadRequestData;
  ctrl: NgxFileUploadControl;
}

/**
 * view for upload
 */
@Component({
  selector: "ngx-file-upload-ui--item",
  templateUrl: "upload-item.html",
  styleUrls: ["./upload-item.scss"],
})
export class UploadItemComponent implements AfterViewInit, OnInit, OnDestroy {

  public uploadState = NgxFileUploadState;

  /**
   * template context which is bound to rendered template
   */
  public context: FileUploadItemContext | undefined;

  /**
   * file upload which should bound to this view
   */
  private fileUpload: NgxFileUploadRequest | undefined;

  /**
   * save subscription here,  since we have only 1 sub
   * i think takeUntil and Subject will be to much so we could
   * unsubscribe directly
   */
  private destroyed: Subject<boolean> = new Subject();

  public i18n: NgxFileUploadUiI18nItem | undefined;

  /**
   * set template which should be used for upload items, if no TemplateRef is passed
   * it will fallback to [defaultUploadItem]{@link #template}
   */
  @ViewChild("defaultUploadItem", { static: true })
  public itemTpl: TemplateRef<FileUploadItemContext> | undefined;

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
  public set upload(request: NgxFileUploadRequest) {
    this.fileUpload = request;
    this.context = {
      data: request.data,
      ctrl: new Control(request)
    };
  }

  public constructor(
    private i18nProvider: NgxFileUploadUiI18nProvider
  ) { }

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
    if (!this.fileUpload) {
      return;
    }

    this.fileUpload.change
      .pipe(takeUntil(this.destroyed))
      .subscribe((fileUpload: INgxFileUploadRequestData) => (this.context as FileUploadItemContext).data = fileUpload);
  }

  ngOnInit() {
    this.i18n = this.i18nProvider.getI18n<NgxFileUploadUiI18nItem>(NgxFileUploadUiI18nKey.UploadItem);
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
