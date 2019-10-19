import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UploadModel } from "../data/upload.model";
import { UploadRequest, UploadOptions } from "../libs/upload/src/upload.request";
import { UploadStore } from "../libs/upload/src/upload.store";

@Injectable({
    providedIn: "root"
})
export class FileUploadFactory {

    public constructor(
        private httpClient: HttpClient
    ) {}

    public createUpload(file: File, options: UploadOptions): UploadRequest {
        const model = new UploadModel(file);
        return new UploadRequest(this.httpClient, model, options);
    }

    public createStore(): UploadStore {
        return new UploadStore();
    }
}
