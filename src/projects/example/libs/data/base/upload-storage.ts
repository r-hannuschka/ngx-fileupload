import { InjectionToken } from "@angular/core";
import { NgxFileUploadStorage } from "@ngx-file-upload/core";

export const ExampleUploadStorage = new InjectionToken<NgxFileUploadStorage>("Example Upload Storage", {
    providedIn: "root",
    factory: () => {
        return new NgxFileUploadStorage({
            concurrentUploads: 3
        });
    }
});
