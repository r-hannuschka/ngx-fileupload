import { UploadStorage } from "@r-hannuschka/ngx-fileupload";
import { Observable } from "rxjs";

export class UploadStorageMock extends UploadStorage {

    public change(): Observable<any> {
        return null;
    }

    /**
     * gets notified if queue changes
     */
    public get queueChange(): Observable<any> {
        return null;
    }

    public destroy() {}

    /**
     * remove upload from store
     */
    public remove() {
    }

    /**
     * remove all uploads which has been invalid
     * canceled or upload has been completed even it is has an error
     */
    public purge() {
    }

    public startAll() {}

    public stopAll() {}

    public removeInvalid() {}
}
