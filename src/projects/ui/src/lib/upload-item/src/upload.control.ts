import { NgxFileUploadRequest, NgxFileUploadControl } from "@ngx-file-upload/core";

/**
 * remote control for a single upload, will passed
 * by [NgxFileUploadItem]{@link ../components/NgxFileUploadItem.html} as context.ctrl
 * to the item template.
 *
 * @example
 *
 * <ng-template let-uploadData="data" let-uploadCtrl="ctrl">
 *     <button type="button" *ngIf="!data.hasError" (click)="uploadCtrl.start($event)">start</button>
 *     <button type="button" *ngIf="data.hasError"  (click)="uploadCtrl.retry($event)">retry</button>
 *     <button type="button"                        (click)="uploadCtrl.cancel($event)">cancel</button>
 * </ng-template>
 *
 * <ngx-file-upload-item *ngFor="item of uploads" [template]="myItemTemplate" [upload]="item"></ngx-fileUpload-item>
 */
export class Control implements NgxFileUploadControl {

    public constructor(private upload: NgxFileUploadRequest) {}

    /**
     * if upload has been failed (http error) it has not completed
     * since connection can be broken or something dont has started yet.
     *
     * Give them a chance for a retry
     */
    public retry(event?: MouseEvent) {
        this.handleEvent(event);
        this.upload.retry();
    }

    /**
     * start single upload
     */
    public start($event?: MouseEvent) {
        this.handleEvent($event);
        this.upload.start();
    }

    /**
     * cancel / stop single upload
     */
    public stop($event?: MouseEvent) {
        this.handleEvent($event);
        this.upload.cancel();
    }

    public remove($event?: MouseEvent) {
        this.handleEvent($event);
        this.upload.destroy();
    }

    private handleEvent(event?: MouseEvent) {
        if (event && event instanceof MouseEvent) {
            event.stopPropagation();
        }
    }
}
