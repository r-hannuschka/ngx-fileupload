import { NgxFileUploadRequestData, NgxFileUploadState, NgxFileUploadResponse, NgxFileUploadValidationErrors } from "../../api";

export class NgxFileUploadFile {
  /**
   * get raw file
   */
  public readonly raw: File;

  /**
   * returns filesize in byte
   */
  public readonly size: number;

  /**
   * returns filename
   */
  public readonly name: string;

  /**
   * returns mime type of file
   */
  public readonly type: string;

  public constructor(file: File) {
    this.raw = file;
    this.size = file.size;
    this.type = file.type;
    this.name = file.name;
  }
}

/**
 * Represents a file which will be uploaded
 */
export class NgxFileUploadRequestModel implements NgxFileUploadRequestData {

  private filesToUpload: NgxFileUploadFile[] = [];

  private totalUploadSize = -1;

  get files(): NgxFileUploadFile[] {
    return this.filesToUpload;
  }

  get size(): number {
    if (this.totalUploadSize < 0) {
      this.totalUploadSize = this.files.reduce((current, file) => current + file.size, 0)
    }
    return this.totalUploadSize
  }

  /**
   * Creates an instance of UploadFile.
   */
  constructor(file: File | File[]) {
    const files = !Array.isArray(file) ? [file] : file;
    this.filesToUpload = files.map((data) => new NgxFileUploadFile(data));
  }

  /**
   * set response data if upload has been completed
   */
  response: NgxFileUploadResponse = {
    body: null,
    errors: null,
    success: false
  };


  /**
   * set current upload state
   */
  state: NgxFileUploadState = NgxFileUploadState.IDLE;

  /**
   * set uploaded size
   */
  uploaded = 0;

  validationErrors: NgxFileUploadValidationErrors | null = null;

  progress = 0;

  hasError = false;
}

/**
 * @deprecated use NgxFileUploadRequestModel instead
 */
export class NgxFileUploadModel extends NgxFileUploadRequestModel {}