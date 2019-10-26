export const TS = `
import { InjectionToken } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";

export const ExampleUploadStorage = new InjectionToken<UploadStorage>("Customize Template Upload Storage", {
    providedIn: "root",
    factory: () => {
        return new UploadStorage({
            concurrentUploads: 3
        });
    }
});
`;
