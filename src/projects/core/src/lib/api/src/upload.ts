import type { Observable } from 'rxjs';
import type { NgxFileUploadValidation } from '..';
import type { NgxFileUploadForm } from '../../upload/src/upload.form';
import type { NgxFileUploadValidationErrors } from './validation';

export interface NgxFileUploadResponse {
  success: boolean;
  errors: any;
  body: any;
}

export enum NgxFileUploadState {
  INVALID = 0,
  IDLE = 1,
  START = 2,
  PENDING = 3,
  CONNECT = 4,
  PROGRESS = 5,
  CANCELED = 6,
  COMPLETED = 7
}

export interface NgxFileUploadControl {
  retry(): void;

  start(): void;

  stop(): void;

  remove(): void;
}

export interface UploadValidation {
  errors: NgxFileUploadValidationErrors | null;
}

export interface INgxFileUploadFile {
  readonly raw: File;

  readonly size: number;

  readonly name: string;

  readonly type: string;

  validationErrors: NgxFileUploadValidationErrors | null;
}

export interface INgxFileUploadRequestData {
  readonly files: INgxFileUploadFile[];

  readonly size: number;

  readonly name: string[];

  response: NgxFileUploadResponse | null;

  state: NgxFileUploadState;

  uploaded: number;

  validationErrors: NgxFileUploadValidationErrors | null;

  progress: number;

  hasError: boolean;
}

export interface INgxFileUploadRequestModel extends INgxFileUploadRequestData {
  toJson(): INgxFileUploadRequestData;
}

export declare type BeforeStartFn = (request: INgxFileUploadRequest) => boolean | Observable<boolean> | Promise<boolean>;

export interface INgxFileUploadRequest {
  requestId: string;

  /**
   * returns observable which notify if file upload state
   * has been changed
   */
  readonly change: Observable<INgxFileUploadRequestData>;

  readonly data: INgxFileUploadRequestData;

  readonly destroyed: Observable<boolean>;

  readonly form: NgxFileUploadForm;

  url: string;

  state: NgxFileUploadState;

  /**
   * @description add additional headers to request
   */
  addHeader(name: string, value: string): void;

  /**
   * @description gets header from request
   */
  getHeader(name: string): string | undefined | AuthorizationHeader;

  /**
   * @description remove additional headers from request
   */
  removeHeader(name: string): void;

  beforeStart(hook: BeforeStartFn): void;

  destroy(): void;

  /**
   * cancel current file upload, this will complete change subject
   */
  cancel(): void;

  /**
   * return true if upload was not completed since the server
   * sends back an error response
   */
  hasError(): boolean;

  isIdle(): boolean;

  /**
   * returns true if validators are set and upload not validated
   */
  isInvalid(): boolean;

  isProgress(): boolean;

  isPending(): boolean;

  isCompleted(ignoreError?: boolean): boolean;

  isCanceled(): boolean;

  removeInvalidFiles(): void;

  retry(): void;

  start(): void;
}

export interface NgxFileUploadStorageConfig {
  /**
   * max count of uploads at once, set to -1 for no limit
   */
  concurrentUploads: number;
  /**
   * if set to true it will automatically starts uploads
   */
  autoStart?: boolean;
  /**
   * if set it will remove success full completed uploads after a specific
   * amount of time.
   */
  removeCompleted?: number;
}

export interface AuthorizationHeader {
  key?: string;
  token: string;
}

export interface NgxFileUploadHeaders {
  [key: string]: string | AuthorizationHeader | undefined;
  authorization?: string | AuthorizationHeader;
}

export interface NgxFileuploadFormControl {
  validator?: NgxFileUploadValidation<NgxFileuploadFormControl>;
  value?: unknown;
  valid: boolean;
  errors: NgxFileUploadValidationErrors | null;
  /**
   * @description form control is dirty, validator, value changed
   */
  dirty: boolean;
  /**
   * @description if set to false form control will not attached to form-data or headers. Default is true.
   * This becomes useful is this formcontrol is only used internal and we need some meta data inside beforeStartFn.
   *
   * @example
   *
   * ```
   * @todo
   * ```
   */
  send?: boolean;
}

export interface NgxFileuploadFormGroup {
  [key: string]: NgxFileuploadFormControl;
}

export declare type NgxFileUploadFormControlOptions = Pick<NgxFileuploadFormControl, 'send' | 'validator' | 'value'>

/**
 * Upload Options
 */
export interface NgxFileUploadOptions {
  /**
   * url which should used to upload file
   */
  url: string;
  /**
   * @description
   */
  headers?: NgxFileUploadHeaders;
  /**
   * @todo docs
   */
  formControls?: Record<string, NgxFileUploadFormControlOptions>;
  /**
   * @description only used if transferMethod is body, so form control names will attached
   * to headers. If formControlNameToKebabCase is set to true name will transformed.
   *
   * default is false
   *
   * @example
   *
   * default behavior
   *
   * ```
   * const config: NgxFileUploadOptions = {
   *   transferMethod: 'body',
   *   formControls: {
   *     userId: {
   *       value: 10
   *     }
   *   }
   * }
   * // header sent userId: 10
   * ```
   *
   * @example
   *
   * formControlNameToKebabCase set to true
   *
   * ```
   * const config: NgxFileUploadOptions = {
   *   transferMethod: 'body',
   *   formControlNameToKebabCase: true,
   *   formControls: {
   *     userId: {
   *       value: 10,
   *     }
   *   }
   * }
   * // header sent User-Id: 10
   * ```
   */
  formControlNameToKebabCase?: boolean;
  /**
   * @description how the file will be send. If set to formdata it will create a FormData Object and attach file to files (good for multiple files at once)
   * Otherwise it will send file as body directly to server.
   *
   * Default is formdata.
   */
  transferMethod?: 'body' | 'formdata';
  /**
   * if set to true will include HTTP-only cookies with the request
   */
  withCredentials?: boolean;
}
