import { FileUpload, FileModel } from 'lib/public-api';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpProgressEvent, HttpEventType } from '@angular/common/http';
import { Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadState } from 'lib/ngx-fileupload/model/file';
import { tap } from 'rxjs/operators';

describe('Model: UploadFile', () => {

    const url = 'https://localhost/file/upload';
    let fileupload: FileUpload;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let uploadFile: File;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
    });

    beforeEach(() => {
        injector   = getTestBed();
        httpMock   = injector.get(HttpTestingController as Type<HttpTestingController>);
        uploadFile = new File(['ngx-fileupload testing'], 'foobar.txt', {type: 'text/plain'});

        const httpClient = injector.get(HttpClient as Type<HttpClient>);
        const model = new FileModel(uploadFile);

        fileupload = new FileUpload(httpClient, model, url);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should submit post request', () => {
        fileupload.start();
        const req = httpMock.expectOne(url);

        expect(req.request.method).toBe('POST');
        expect(req.request.url).toBe(url);
    });

    it('should submit file', () => {
        fileupload.start();

        const req  = httpMock.expectOne(url);
        const body = req.request.body as FormData;

        expect(body.has('file')).toBeTruthy();
        expect(body.get('file') as File).toEqual(uploadFile);
    });

    it('should complete upload', (done) => {
        const states: UploadState[] = [];
        fileupload.change
            .pipe(tap({
                next: (file: FileModel) => states.push(file.state),
            }))
            .subscribe({
                complete: () => {
                    expect(states).toEqual([UploadState.QUEUED, UploadState.START, UploadState.PROGRESS, UploadState.UPLOADED]);
                    done();
                }
            });

        fileupload.start();
        const mockReq = httpMock.expectOne(url);
        mockReq.event({type: HttpEventType.UploadProgress, loaded: 7, total: 10 } as HttpProgressEvent);
        mockReq.flush('');
    });

    it('should cancel upload', (done) => {
        fileupload.change
            .subscribe({
                complete: () => {
                    expect(fileupload.file.state).toBe(UploadState.CANCELED);
                    done();
                }
            });

        fileupload.start();
        httpMock.expectOne(url);
        // cancel request
        fileupload.cancel();
    });

    it('should not start upload if allready running', () => {
        const file = fileupload.file;
        file.state = UploadState.PROGRESS;
        fileupload.start();
        httpMock.expectNone(url);
    });

    it('should not cancel upload if allready done / canceled', () => {
        fileupload.start();
        const mockReq = httpMock.expectOne(url);
        mockReq.flush('');
        fileupload.cancel();
        expect(fileupload.file.state).toBe(UploadState.UPLOADED);
    });
});
