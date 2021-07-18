import { ValidationErrors } from "@angular/forms";
import { NgxFileUploadRequestData, NgxFileUploadState, NgxFileUploadResponse } from "../../api";

export class NgxFileUploadFile {
  public readonly raw: File
  public readonly size: number
  public readonly name: string
  public readonly type: string

  validationErrors: ValidationErrors | null = null

  public constructor(file: File) {
    this.raw = file
    this.size = file.size
    this.type = file.type
    this.name = file.name
  }
}

/**
 * Represents an upload request, and store the data inside
 */
export class NgxFileUploadRequestModel implements NgxFileUploadRequestData {

  private filesToUpload: NgxFileUploadFile[] = []

  constructor(file: NgxFileUploadFile | NgxFileUploadFile[]) {
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

  get validationErrors(): ValidationErrors | null {
    const validationErrors = this.files.reduce<ValidationErrors>((errors, file) => {
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

  toJson(): NgxFileUploadRequestData {
    return {
      ...this,
      validationErrors: this.validationErrors,
      size: this.size,
      name: this.name,
      files: this.files
    };
  }
}

/**
 * @deprecated use NgxFileUploadRequestModel instead
 */
export class NgxFileUploadModel extends NgxFileUploadRequestModel {}