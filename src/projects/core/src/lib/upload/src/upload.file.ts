import { NgxFileUploadValidationErrors, INgxFileUploadFile } from "../../api";

export class NgxFileUploadFile implements INgxFileUploadFile {
  readonly raw: File

  readonly size: number

  readonly name: string

  readonly type: string

  validationErrors: NgxFileUploadValidationErrors | null = null

  public constructor(file: File) {
    this.raw = file
    this.size = file.size
    this.type = file.type
    this.name = file.name
  }
}
