import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, interval } from "rxjs";
import { Injectable } from "@angular/core";
import { takeWhile, map, finalize } from "rxjs/operators";

interface FakeUpload {
    state: "start" | "progress" | "completed";
    uploaded: number;
    size: number;
}

@Injectable()
export class FakeUploadInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf("upload") === -1) {
            return next.handle(req);
        }

        const file: File = req.body.get("file");
        return this.createFakeUpload(file);
    }

    private createFakeUpload(file: File): Observable<HttpEvent<any>> {

        return new Observable<HttpEvent<any>>((observer) => {

            observer.next({type: HttpEventType.Sent});

            /** start fake upload */
            const chunkSize = 2048 * 16;
            const upload: FakeUpload = {
                state: "progress",
                uploaded: 0,
                size: file.size
            };

            // fake upload
            interval(100).pipe(
                takeWhile(() => upload.state !== "completed"),
                map(() => {
                    const tmpUploaded   = upload.uploaded + chunkSize;
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
                }),
                finalize(() => {

                    const error: HttpErrorResponse = new HttpErrorResponse({
                        status: 401,
                        error: ["no access"],
                        statusText: "you are not allowed to upload anything."
                    });
                    observer.error(error);

                    /*
                    const response = new HttpResponse({
                        status: 401
                    });
                    observer.next(response);
                    */
                })
            ).subscribe();
        });
    }
}
