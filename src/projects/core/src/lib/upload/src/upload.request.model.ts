import {
  NgxFileUploadState,
  type INgxFileUploadFile,
  type INgxFileUploadRequestData,
  type INgxFileUploadRequestModel,
  type NgxFileUploadResponse,
  type NgxFileUploadValidationErrors,
} from '../../api';
import type { NgxFileUploadFile } from './upload.file';

/**
 * Represents an upload request, and store the data inside
 */
export class NgxFileUploadRequestModel implements INgxFileUploadRequestModel {

  private errors: NgxFileUploadValidationErrors | null = null;

  constructor(
    private readonly filesToUpload: INgxFileUploadFile | INgxFileUploadFile[],
  ) { }

  get files(): NgxFileUploadFile[] {
    return Array.isArray(this.filesToUpload) ? this.filesToUpload : [this.filesToUpload];
  }

  get name(): string[] {
    return this.files.map((file) => file.name);
  }

  get size(): number {
    return this.files.reduce((size, file) => size + file.size, 0);
  }

  get validationErrors(): NgxFileUploadValidationErrors | null {
    return this.errors;
  }

  response: NgxFileUploadResponse = {
    body: null,
    errors: null,
    success: false,
  };

  state: NgxFileUploadState = NgxFileUploadState.IDLE;

  uploaded = 0;

  progress = 0;

  hasError = false;

  toJson(): INgxFileUploadRequestData {
    return {
      files: this.files,
      hasError: this.hasError,
      name: this.name,
      progress: this.progress,
      response: this.response,
      size: this.size,
      state: this.state,
      uploaded: this.uploaded,
      validationErrors: this.validationErrors,
    };
  }
}
