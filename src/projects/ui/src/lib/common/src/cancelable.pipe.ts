import { Pipe, PipeTransform } from "@angular/core";
import { UploadState } from "@ngx-file-upload/core";

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

    transform(state: UploadState): boolean {
        let isCancelAble = state === UploadState.PENDING;
        isCancelAble     = isCancelAble || state === UploadState.START;
        isCancelAble     = isCancelAble || state === UploadState.PROGRESS;
        return isCancelAble;
    }
}
