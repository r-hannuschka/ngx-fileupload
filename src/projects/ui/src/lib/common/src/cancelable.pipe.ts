import { Pipe, PipeTransform } from "@angular/core";
import { NgxFileUploadState } from "@ngx-file-upload/core";

/**
 * returns true if an upload could be canceled
 * an upload could canceled if state is one of these: PENDING, START or PROGRESS
 *
 * @example
 * <button [disabled]="!(upload.data.state | isCancelAble)">cancel</button>
 */
@Pipe({
    name: "isCancelAble"
})
export class CancelAblePipe implements PipeTransform {

    transform(state: NgxFileUploadState): boolean {
        let isCancelAble = state === NgxFileUploadState.PENDING;
        isCancelAble     = isCancelAble || state === NgxFileUploadState.START;
        isCancelAble     = isCancelAble || state === NgxFileUploadState.PROGRESS;
        return isCancelAble;
    }
}
