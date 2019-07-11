import { FileUpload } from "./file-upload";

/**
 * remote control for a single upload, will passed
 * by [NgxFileUploadItem]{@link ../components/NgxFileUploadItem.html} as context.ctrl
 * to the item template.
 *
 * @example
 *
 * <ng-template let-uploadData="data" let-uploadCtrl="ctrl">
 *     <button type="button" *ngIf="!data.hasError" (click)="uploadCtrl.start()">start</button>
 *     <button type="button" *ngIf="data.hasError"  (click)="uploadCtrl.retry()">retry</button>
 *     <button type="button"                        (click)="uploadCtrl.cancel()">cancel</button>
 * </ng-template>
 *
 * <ngx-fileupload-item *ngFor="item of uploads" [template]="myItemTemplate" [upload]="item"></ngx-fileUpload-item>
 */
export class UploadControl {

    /**
     *
     */
    public constructor(
        private fileUpload: FileUpload
    ) {}

    /**
     * if upload has been failed (http error) it has not completed
     * since connection can be broken or something dont has started yet.
     *
     * Give them a chance for a retry
     */
    public retry() {
        this.fileUpload.retry();
    }

    /**
     * start single upload
     */
    public start() {
        this.fileUpload.start();
    }

    /**
     * cancel / stop single upload
     */
    public stop() {
        this.fileUpload.cancel();
    }
}
