import { Pipe, PipeTransform } from "@angular/core";
import { NgxFileUploadState } from "@ngx-file-upload/core";

/**
 * converts upload state to string value
 *
 * @example
 * <span>{{upload.state | stateToString}}</span>
 * // prints one of these idle, pending, progress, completed, start, invalid, canceled
 */
@Pipe({
    name: "stateToString"
})
export class StateToStringPipe implements PipeTransform {

    transform(state: NgxFileUploadState): string {

        switch (state) {
            case NgxFileUploadState.CANCELED:  return "canceled";
            case NgxFileUploadState.PENDING:   return "pending";
            case NgxFileUploadState.PROGRESS:  return "progress";
            case NgxFileUploadState.COMPLETED: return "completed";
            case NgxFileUploadState.START:     return "start";
            case NgxFileUploadState.INVALID:   return "invalid";
            default:                           return "idle";
        }
    }
}
