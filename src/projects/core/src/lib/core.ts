import { NgModule } from "@angular/core";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

@NgModule({ imports: [], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class NgxFileUploadCoreModule {}
