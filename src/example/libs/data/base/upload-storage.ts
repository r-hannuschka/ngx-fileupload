import { InjectionToken } from "@angular/core";
import { UploadStorage } from "projects/ngx-fileupload/public-api";

export const ExampleUploadStorage = new InjectionToken<UploadStorage>("Example Upload Storage", {
    providedIn: "root",
    factory: () => {
        return new UploadStorage({
            concurrentUploads: 3
        });
    }
});
