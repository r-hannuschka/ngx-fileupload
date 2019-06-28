import { NgModule, Injectable } from '@angular/core';
import { NgxFileuploadModule } from 'lib/public-api';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyComponent } from './my.component';
import { CommonModule } from '@angular/common';

@Injectable()
export class ChildUploadInterceptor implements HttpInterceptor {

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req);
    }
}

@NgModule({
    imports: [
        CommonModule,
        NgxFileuploadModule
    ],
    exports: [MyComponent],
    declarations: [MyComponent]
})
export class MyModule { }
