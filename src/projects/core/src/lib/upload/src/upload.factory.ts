import { InjectionToken, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgxFileUploadOptions, NgxFileUploadRequest, NgxFileUploadValidation } from "../../api";
import { NgxFileUploadRequestModel } from "./upload.model";
import { NgxFileUpload } from "./upload.request";

export interface NgxFileUploadFactory {
  createUploadRequest<T extends File | File[]>(
    file: T, options: NgxFileUploadOptions, validator?: NgxFileUploadValidation
  ): T extends File[] ? NgxFileUploadRequest[] : NgxFileUploadRequest;
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
  ) { }

  public createUploadRequest(file: File, options: NgxFileUploadOptions, validator: NgxFileUploadValidation): NgxFileUploadRequest;
  public createUploadRequest(file: File[], options: NgxFileUploadOptions, validator: NgxFileUploadValidation): NgxFileUploadRequest[];
  // public createUploadRequest(file: File | File[], options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): NgxFileUploadRequest | NgxFileUploadRequest[] {
  public createUploadRequest(file: File | File[], options: NgxFileUploadOptions): NgxFileUploadRequest | NgxFileUploadRequest[] {
    /**
     * validate files here
     */
    const model = new NgxFileUploadRequestModel(file);
    return new NgxFileUpload(this.httpClient, model, options);
  }

  /**
   * build concrete upload request
   *
  private buildRequest(file: File | File[], options: NgxFileUploadOptions, validator?: NgxFileUploadValidation): NgxFileUploadRequest {
      const model = new NgxFileUploadRequestModel(file);
      let validationResult = null;

      if (validator) {
          validationResult = "validate" in validator ? validator.validate(file) : validator(file);
      }

      if (validationResult !== null) {
          model.state = NgxFileUploadState.INVALID;
          model.validationErrors = validationResult;
      }
      /** we can have multiple models in 1 request *
  }
  */
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>("Ngx Fileupload Factory", {
  providedIn: "root",
  factory: () => new Factory(inject(HttpClient))
});
