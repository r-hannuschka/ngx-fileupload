export const TS = `
import { InjectionToken } from "@angular/core";
import { NgxFileUploadStorage } from "@ngx-file-upload/core";

export const ExampleUploadStorage = new InjectionToken<NgxFileUploadStorage>("Customize Template Upload Storage", {
    providedIn: "root",
    factory: () => {
        return new NgxFileUploadStorage({
            concurrentUploads: 3
        });
    }
});
`;
