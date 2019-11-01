import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UploadModel } from "../../data/upload.model";
import { UploadRequest, UploadOptions } from "../upload/src/upload.request";
import { UploadStorage } from "../upload/src/upload.storage";

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

    public createStore(): UploadStorage {
        return new UploadStorage();
    }
}
