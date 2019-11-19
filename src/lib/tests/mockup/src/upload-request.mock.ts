import { Observable, Subject } from "rxjs";
import { FileUpload, Upload } from "@r-hannuschka/ngx-fileupload";

/**
 * represents a single fileupload
 */
export class UploadRequestMock implements Upload {

    public uploadFile: FileUpload;

    private change$: Subject<FileUpload>;

    start(): void {
    }

    cancel(): void {
    }

    hasError(): boolean {
        return false;
    }

    isInvalid(): boolean {
        return false;
    }

    public constructor(model: FileUpload) {
        this.uploadFile = model;
        this.change$ = new Subject();
    }

    public get change(): Observable<FileUpload> {
        return this.change$.asObservable();
    }

    public applyChange() {
        this.change$.next(this.uploadFile);
    }
}
