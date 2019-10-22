import { InjectionToken } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";

export const CTUploadStorage = new InjectionToken<UploadStorage>("Customize Template Upload Storage", {
    providedIn: "root",
    factory: () => {
        return new UploadStorage({
            concurrentUploads: 1
        });
    }
});
