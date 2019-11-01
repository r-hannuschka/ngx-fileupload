import { Pipe, PipeTransform } from "@angular/core";
import { UploadState } from "../../data/api";

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

    transform(state: UploadState): string {

        switch (state) {
            case UploadState.IDLE:      return "idle";
            case UploadState.PENDING:   return "pending";
            case UploadState.PROGRESS:  return "progress";
            case UploadState.COMPLETED: return "completed";
            case UploadState.START:     return "start";
            case UploadState.INVALID:   return "invalid";
            default:                    return "canceled";
        }
    }
}
