import { FileUpload } from "../http/file-upload";
import { BehaviorSubject, Observable } from "rxjs";

export class FileUploadStore {

    private change$: BehaviorSubject<FileUpload[]>;

    private uploads: Set<FileUpload> = new Set();

    public constructor() {
        this.change$ = new BehaviorSubject([]);
    }

    public add(upload: FileUpload) {
        this.uploads.add(upload);
        this.change$.next(Array.from(this.uploads.values()));
    }

    public delete(upload: FileUpload) {
        if (this.uploads.has(upload)) {
            upload.cancel();
            this.uploads.delete(upload);
            this.change$.next(Array.from(this.uploads.values()));
        }
    }

    public clear() {
        this.uploads.forEach(upload => upload.cancel());
        this.uploads.clear();
        this.change$.next([]);
    }

    public change(): Observable<FileUpload[]> {
        return this.change$.asObservable();
    }
}
