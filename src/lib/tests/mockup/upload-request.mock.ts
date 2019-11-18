import { Observable, BehaviorSubject } from "rxjs";
import { UploadModel } from "@r-hannuschka/ngx-fileupload";

/**
 * represents a single fileupload
 */
export class UploadRequestMock {

    private change$: BehaviorSubject<UploadModel>;

    public constructor(private model?: UploadModel) {
        if (this.model) {
            this.change$ = new BehaviorSubject(this.model);
        }
    }

    public get change(): Observable<UploadModel> {
        if (this.change$ instanceof BehaviorSubject) {
            return this.change$.asObservable();
        }
    }

    public applyChange() {
        if (this.change$ instanceof BehaviorSubject) {
            this.change$.next(this.model);
        }
    }
}
