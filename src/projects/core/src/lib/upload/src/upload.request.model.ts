import { INgxFileUploadFile, INgxFileUploadRequestData, INgxFileUploadRequestModel, NgxFileUploadResponse, NgxFileUploadState, NgxFileUploadValidationErrors } from "../../api"
import { NgxFileUploadFile } from "./upload.model"

/**
 * Represents an upload request, and store the data inside
 */
export class NgxFileUploadRequestModel implements INgxFileUploadRequestModel {

  private filesToUpload: NgxFileUploadFile[] = []

  constructor(file: INgxFileUploadFile | INgxFileUploadFile[]) {
    this.filesToUpload = !Array.isArray(file) ? [file] : file
  }

  get files(): NgxFileUploadFile[] {
    return this.filesToUpload
  }

  get name(): string[] {
    return this.files.map((file) => file.name)
  }

  get size(): number {
    return this.files.reduce((size, file) => size + file.size, 0)
  }

  get validationErrors(): NgxFileUploadValidationErrors | null {
    const validationErrors = this.files.reduce<NgxFileUploadValidationErrors>((errors, file) => {
      if (file.validationErrors) {
        errors[file.name] = {...file.validationErrors}
      }
      return errors
    }, {})
    return Object.keys(validationErrors).length ? validationErrors : null
  }

  response: NgxFileUploadResponse = {
    body: null,
    errors: null,
    success: false
  }

  state: NgxFileUploadState = NgxFileUploadState.IDLE

  uploaded = 0

  progress = 0

  hasError = false

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
      validationErrors: this.validationErrors
    }
  }
}