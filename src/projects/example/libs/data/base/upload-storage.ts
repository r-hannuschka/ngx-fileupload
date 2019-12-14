import { InjectionToken } from "@angular/core";
import { UploadStorage } from "@ngx-file-upload/core";

export const ExampleUploadStorage = new InjectionToken<UploadStorage>("Example Upload Storage", {
    providedIn: "root",
    factory: () => {
        return new UploadStorage({
            concurrentUploads: 3
        });
    }
});
