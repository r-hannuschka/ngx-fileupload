import { NgModule } from '@angular/core';
import { NgxFileuploadModule, NGX_FILEUPLOAD_VALIDATOR } from 'lib/public-api';
import { MaxUploadSizeValidator } from './validators/max-size.validator';

@NgModule({
    exports: [ NgxFileuploadModule ],
    imports: [ NgxFileuploadModule ],
    providers: [{
        provide: NGX_FILEUPLOAD_VALIDATOR,
        useClass: MaxUploadSizeValidator,
        multi: true
    }],
})
export class AppUploadModule { }
