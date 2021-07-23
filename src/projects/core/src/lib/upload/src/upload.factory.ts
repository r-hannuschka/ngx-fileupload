import { InjectionToken, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { INgxFileUploadRequest, NgxFileUploadOptions, NgxFileUploadState, NgxFileUploadValidation } from "../../api"
import { NgxFileUploadFile, NgxFileUploadRequestModel } from "./upload.model"
import { NgxFileUploadRequest } from "./upload.request"

export interface NgxFileUploadFactory {
  createUploadRequest<T extends File | File[]>(
    file: T, options: NgxFileUploadOptions, validator?: NgxFileUploadValidation
  ): T extends File[] ? INgxFileUploadRequest[] : INgxFileUploadRequest;
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

  public createUploadRequest(file: File, options: NgxFileUploadOptions, validator: NgxFileUploadValidation): NgxFileUploadRequest;
  public createUploadRequest(file: File[], options: NgxFileUploadOptions, validator: NgxFileUploadValidation): NgxFileUploadRequest[];
  public createUploadRequest(file: File | File[], options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): NgxFileUploadRequest | NgxFileUploadRequest[] {
    const files = Array.isArray(file) ? file : [file]
    const fileModels: NgxFileUploadFile[] = files.map((file) => {
      const model = new NgxFileUploadFile(file)
      if (validator) {
        model.validationErrors = "validate" in validator ? validator.validate(file) : validator(file)
      }
      return model
    });

    const requestModel = new NgxFileUploadRequestModel(fileModels)
    if (requestModel.validationErrors) {
      requestModel.state = NgxFileUploadState.INVALID;
    }

    return new NgxFileUploadRequest(this.httpClient, requestModel, options)
  }
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>("Ngx Fileupload Factory", {
  providedIn: "root",
  factory: () => new Factory(inject(HttpClient))
});
