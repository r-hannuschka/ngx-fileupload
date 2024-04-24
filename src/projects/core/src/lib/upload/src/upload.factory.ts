import { HttpClient } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { INgxFileUploadFile, INgxFileUploadRequest, NgxFileUploadOptions, NgxFileUploadValidation } from '../../api';
import { NgxFileUploadRequest } from './upload.request';
import { NgxFileUploadFile } from './upload.file';

export interface NgxFileUploadFactory {
  createUploadRequest(
    file: File | File[],
    options: NgxFileUploadOptions,
    validator?: NgxFileUploadValidation | null,
  ): INgxFileUploadRequest | null;
}

/**
 * Factory to create upload requests
 */
class Factory implements NgxFileUploadFactory {
  /**
   * construct upload factory
   */
  public constructor(private httpClient: HttpClient) {}

  public createUploadRequest(
    file: File | File[],
    options: NgxFileUploadOptions,
    validator?: NgxFileUploadValidation,
  ): INgxFileUploadRequest | null {
    const files = Array.isArray(file) ? file : [file];

    if (files.length) {
      const fileModels: INgxFileUploadFile[] = files.map((file) => {
        const model = new NgxFileUploadFile(file);
        if (validator) {
          model.validationErrors = 'validate' in validator ? validator.validate(file) : validator(file);
        }
        return model;
      });

      // * create one requests which holds all files
      return new NgxFileUploadRequest(this.httpClient, fileModels, options);
    }

    return null;
  }
}

/**
 * InjectionToken for NgxFileuploadFactory
 */
export const NgxFileUploadFactory = new InjectionToken<NgxFileUploadFactory>('Ngx Fileupload Factory', {
  providedIn: 'root',
  factory: () => new Factory(inject(HttpClient)),
});
