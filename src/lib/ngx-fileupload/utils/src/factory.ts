import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UploadModel } from "../../data/upload.model";
import { FileUpload, UploadOptions } from "./http/file-upload";
import { FileUploadStore } from "./store/upload.store";

@Injectable({
    providedIn: "root"
})
export class FileUploadFactory {

    public constructor(
        private httpClient: HttpClient
    ) {}

    public createUpload(file: File, options: UploadOptions): FileUpload {
        const model = new UploadModel(file);
        return new FileUpload(this.httpClient, model, options);
    }

    public createStore(): FileUploadStore {
        return new FileUploadStore();
    }
}
