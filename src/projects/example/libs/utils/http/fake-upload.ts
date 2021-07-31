import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, interval, Subscriber } from "rxjs";
import { Injectable } from "@angular/core";
import { takeWhile } from "rxjs/operators";

interface FakeUpload {
    state: "start" | "progress" | "completed";
    uploaded: number;
    size: number;
}

@Injectable()
export class FakeUploadInterceptor implements HttpInterceptor {

    /**
     * chunk size: upload speed for 16MBit DSL per second (with sunshine and gas station in front)
     */
    private chunkSize = 1024 * 1024

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf("upload") === -1) {
            return next.handle(req)
        }
        debugger
        const file: File[] = req.body.has("file") ? req.body.getAll("file") : req.body.getAll("picture")
        return this.createFakeUpload(file, req.url.indexOf("error") !== -1)
    }

    /**
     * return fake upload observable for http client
     */
    private createFakeUpload(files: File[], hasError = false): Observable<HttpEvent<any>> {
        return new Observable<HttpEvent<any>>((observer) => {
            observer.next({type: HttpEventType.Sent})
            const upload: FakeUpload = {
                state: "progress",
                uploaded: 0,
                size: files.reduce((size, file) => size + file.size, 0)
            };

            // fake upload
            interval(1000).pipe(
                takeWhile(() => upload.state !== "completed")
            ).subscribe({
                next: () => this.nextTick(upload, observer),
                complete: () => this.uploadCompleted(observer, files.map((file) => file.name).join(', '), hasError)
            });
        });
    }

    /**
     * tick next chunk was "uploaded"
     */
    private nextTick(upload: FakeUpload, observer: Subscriber<HttpEvent<any>>): void {
        const tmpUploaded   = upload.uploaded + this.chunkSize;
        const uploadedTotal = tmpUploaded < upload.size ? tmpUploaded : upload.size;

        upload.uploaded = uploadedTotal;

        observer.next({
            type: HttpEventType.UploadProgress,
            loaded: upload.uploaded,
            total: upload.size
        });

        if (uploadedTotal === upload.size) {
            upload.state = "completed";
        }
    }

    /**
     * upload has been completed
     */
    private uploadCompleted(observer: Subscriber<HttpEvent<any>>, fileName: string, hasError = false ): void {

        if (hasError) {
            const error: HttpErrorResponse = new HttpErrorResponse({
                status: 401,
                error: ["Fakeuploader Random Error", "An error occured"]
            });
            observer.error(error);
        } else {
            const response = new HttpResponse({
                status: 201,
                body: {
                    file: { id: 0, type: "any" },
                    message: `Hoooray File: ${fileName} uploaded to /dev/null`
                }
            });
            observer.next(response);
        }
    }
}
