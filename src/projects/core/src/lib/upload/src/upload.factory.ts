import { InjectionToken, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { INgxFileUploadRequest, NgxFileUploadOptions, NgxFileUploadState, NgxFileUploadValidation } from "../../api"
import { NgxFileUploadFile, NgxFileUploadRequestModel } from "./upload.model"
import { NgxFileUploadRequest } from "./upload.request"
import { INgxFileUploadFile, INgxFileUploadRequestModel } from "dist/core/public-api"

export interface NgxFileUploadFactory {
  createUploadRequest<T extends File | File[]>(
    file: T, options: NgxFileUploadOptions, validator?: NgxFileUploadValidation, filesPerRequest?: number
  ): INgxFileUploadRequest[];
}

/**
 * Factory to create upload requests
 */
class Factory implements NgxFileUploadFactory {

  /**
   * construct upload factory
   */
  public constructor(
    private httpClient: HttpClient
  ) {}

  public createUploadRequest(file: File | File[], options: NgxFileUploadOptions, validator?: NgxFileUploadValidation, filesPerRequest = 1): INgxFileUploadRequest[] {
    const files = Array.isArray(file) ? file : [file]
    if (!files.length || filesPerRequest === 0) {
      return []
    }

    const fileModels: INgxFileUploadFile[] = files.map((file) => {
      const model = new NgxFileUploadFile(file)
      if (validator) {
        model.validationErrors = "validate" in validator ? validator.validate(file) : validator(file)
      }
      return model
    });

    // * create one requests which holds all files
    if (filesPerRequest === -1) {
      const requestModel = this.createRequestModel(fileModels);
      return [new NgxFileUploadRequest(this.httpClient, requestModel, options)]
    }

    // * create 1 or multiple upload requests
    const requests: INgxFileUploadRequest[] = []
    do {
      const uploads = fileModels.splice(0, filesPerRequest);
      const requestModel = this.createRequestModel(uploads);
      requests.push(new NgxFileUploadRequest(this.httpClient, requestModel, options))
    } while (fileModels.length)
    return requests
  }

  private createRequestModel(files: INgxFileUploadFile[]): INgxFileUploadRequestModel {
      const requestModel = new NgxFileUploadRequestModel(files)
      requestModel.state = requestModel.validationErrors ? NgxFileUploadState.INVALID : NgxFileUploadState.IDLE
      return requestModel
  }
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>("Ngx Fileupload Factory", {
  providedIn: "root",
  factory: () => new Factory(inject(HttpClient))
});
