import { NgModule } from "@angular/core";
import { NgxFileUploadModule, NGX_FILEUPLOAD_VALIDATOR } from "lib/public-api";
import { OnlyZipValidator } from "./validators/only-zip.validator";

@NgModule({
    exports: [ NgxFileUploadModule ],
    imports: [ NgxFileUploadModule ],
    providers: [{
        provide: NGX_FILEUPLOAD_VALIDATOR,
        useClass: OnlyZipValidator,
        multi: true
    }],
})
export class AppUploadModule { }
