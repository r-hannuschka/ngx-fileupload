import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpProgressEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, Subject, concat, from, isObservable, merge, of } from 'rxjs';
import { bufferCount, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import {
  INgxFileUploadRequest,
  INgxFileUploadRequestData,
  NgxFileUploadOptions,
  NgxFileUploadResponse,
  NgxFileUploadState,
  type BeforeStartFn,
  type NgxFileUploadHeaders,
  type NgxFileUploadValidationErrors,
} from '../../api';
import type { NgxFileUploadFile } from './upload.file';
import { NgxFileUploadForm } from './upload.form';
import { NgxFileUploadRequestModel } from './upload.request.model';

export class NgxFileUploadRequest implements INgxFileUploadRequest {
  private cancel$: Subject<boolean> = new Subject();
  private change$: Subject<INgxFileUploadRequestData> = new Subject();
  private destroyed$: Subject<boolean> = new Subject();
  private totalSize = -1;

  private options: NgxFileUploadOptions = {
    url: '',
    withCredentials: false,
    transferMethod: 'formdata',
    formControlNameToKebabCase: false,
  };

  private model: NgxFileUploadRequestModel;

  private readonly uploadForm: NgxFileUploadForm;

  private hooks: { beforeStart: BeforeStartFn[] } = { beforeStart: [] };

  private headers: NgxFileUploadHeaders = {};

  private uploadUrl: string = '';

  get change(): Observable<INgxFileUploadRequestData> {
    return this.change$.asObservable();
  }

  get destroyed(): Observable<boolean> {
    return this.destroyed$.asObservable();
  }

  get data(): INgxFileUploadRequestData {
    return this.model.toJson();
  }

  set state(state: NgxFileUploadState) {
    const prevState = this.state;
    this.model.state = state;

    if (prevState !== state) {
        this.notifyObservers();
    }
  }

  get state(): NgxFileUploadState {
    return this.model.state;
  }

  get form(): NgxFileUploadForm {
    return this.uploadForm;
  }

  set url(url: string) {
    if (this.state <= NgxFileUploadState.IDLE) {
      this.uploadUrl = url;
    }
  }

  get url(): string {
    return this.uploadUrl;
  }

  requestId: string = '';

  constructor(private http: HttpClient, files: NgxFileUploadFile | NgxFileUploadFile[], options: NgxFileUploadOptions) {
    // additional form data hinzufuegen muessen
    this.options = { ...this.options, ...options };
    this.model = new NgxFileUploadRequestModel(files);

    this.uploadForm = this.createForm();
    this.state = this.isInvalid() ? NgxFileUploadState.INVALID : NgxFileUploadState.IDLE;

    this.headers = structuredClone(this.options.headers ?? {});
    this.url = this.options.url;

    /**
     * subscribe to validation state change for form, if state changed update validility for uploda request
     */
    this.uploadForm.validationState.pipe(takeUntil(this.destroyed$), distinctUntilChanged()).subscribe(() => this.updateValidility());
  }

  getHeader(name: string) {
    return this.headers[name];
  }

  /**
   * @description add additional headers to request
   */
  addHeader(name: string, value: string) {
    if (this.state !== NgxFileUploadState.IDLE) {
      return;
    }
    this.headers[name] = value;
  }

  /**
   * @description remove additional headers from request
   */
  removeHeader(name: string) {
    if (this.state !== NgxFileUploadState.IDLE) {
      return;
    }
    delete this.headers[name];
  }

  beforeStart(hook: BeforeStartFn) {
    this.hooks.beforeStart = [...this.hooks.beforeStart, hook];
  }

  /**
   * cancel current file upload, this will complete change subject
   */
  cancel() {
    if (this.isProgress() || this.isPending()) {
      this.model.state = NgxFileUploadState.CANCELED;
      this.notifyObservers();
      this.cancel$.next(true);
    }
  }

  destroy() {
    this.finalizeUpload();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * return true if upload was not completed since the server
   * sends back an error response
   */
  hasError(): boolean {
    return this.model.state === NgxFileUploadState.COMPLETED && !this.model.response?.success;
  }

  isCompleted(ignoreError = false): boolean {
    let isCompleted = this.isRequestCompleted();
    isCompleted = isCompleted && (ignoreError || !this.hasError());
    isCompleted = isCompleted || this.model.state === NgxFileUploadState.CANCELED;
    return isCompleted;
  }

  isCanceled(): boolean {
    return this.model.state === NgxFileUploadState.CANCELED;
  }

  isInvalid(): boolean {
    return this.state === NgxFileUploadState.INVALID || this.model.validationErrors !== null;
  }

  isProgress(): boolean {
    return this.state === NgxFileUploadState.PROGRESS || this.state === NgxFileUploadState.START;
  }

  isPending(): boolean {
    return this.state === NgxFileUploadState.PENDING;
  }

  isIdle(): boolean {
    return this.state === NgxFileUploadState.IDLE;
  }

  isRequestCompleted() {
    return this.state === NgxFileUploadState.COMPLETED;
  }

  /**
   * restart download again
   * reset state, and reset errors
   */
  retry() {
    if ((this.isRequestCompleted() && this.hasError()) || this.isCanceled()) {
      this.model = new NgxFileUploadRequestModel(this.model.files);
      this.start();
    }
  }

  /**
   * start file upload
   */
  start() {
    if (!this.isIdle() && !this.isPending()) {
      return;
    }

    this.beforeStartHook$.pipe(filter((isAllowedToStart) => isAllowedToStart)).subscribe(() => {
      this.state = NgxFileUploadState.START;
    });
  }

  /**
   * @description internal use only, before start hooks can become async if they return simple
   * boolean value or a promise. A boolean Value will turned into a Promise into an observable.
   */
  run() {
    this.startUploadRequest().subscribe({
      next: (event: HttpEvent<string>) => this.handleHttpEvent(event),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  removeInvalidFiles() {
    if (this.state !== NgxFileUploadState.INVALID) {
      return;
    }

    const files = this.data.files.filter((file) => file.validationErrors === null);

    if (files.length) {
      this.model = new NgxFileUploadRequestModel(files);
      this.state = NgxFileUploadState.IDLE;
    } else {
      this.destroy();
    }
  }

  /**
   * @description updates validility for upload request
   */
  private updateValidility() {
    if (this.state > NgxFileUploadState.IDLE) {
      return;
    }

    let validationErrors: Record<string, unknown> = {};

    // validation errors file
    validationErrors = this.model.files.reduce<NgxFileUploadValidationErrors>((errors, file) => {
      if (file.validationErrors) {
        return {
          ...errors,
          [file.name]: { ...file.validationErrors },
        };
      }
      return errors;
    }, {});

    // validation errors form
    if (this.form.errors !== null) {
      validationErrors = { ...validationErrors, ...this.form.errors };
    }

    const errors = Object.keys(validationErrors).length ? validationErrors : null;
    if (errors === null) {
      this.state = NgxFileUploadState.IDLE;
      return;
    }

    this.state = NgxFileUploadState.INVALID;
  }

  /**
   * call hooks in order, see playground
   * @see https://rxviz.com/v/58GkkYv8
   */
  private get beforeStartHook$(): Observable<boolean> {
    const initialState = this.model.state;
    let hook$: Observable<boolean> = of(true);
    if (this.hooks.beforeStart.length) {
      const hooks = this.hooks.beforeStart.map((beforeStartFn) => {
        let hook = beforeStartFn(this);
        if (!isObservable(hook)) {
          hook = from(Promise.resolve(hook));
        }
        return hook;
      });

      // push hooks into a stream so everyone is called
      hook$ = concat(...hooks).pipe(
        bufferCount(this.hooks.beforeStart.length),
        map((result) => result.every((isAllowed) => isAllowed)),
        tap(() => (this.model.state !== initialState ? this.notifyObservers() : void 0)),
      );
    }
    return hook$;
  }

  private createForm(): NgxFileUploadForm {
    const form = new NgxFileUploadForm(this);
    for (const [name, ctrlOptions] of Object.entries(this.options.formControls ?? {})) {
      form.addControl(name, ctrlOptions);
    }
    return form;
  }

  /**
   * build form data and send request to server
   */
  private startUploadRequest(): Observable<HttpEvent<string>> {
    const uploadBody = this.createUploadBody();
    const headers = this.createUploadHeaders();

    /**
     * save size on start so we do not call it every time
     * since this running a reduce loop, and the size will not change
     * anymore after we start it
     */
    this.totalSize = this.model.size;

    return this.http
      .post<string>(this.url, uploadBody, {
        reportProgress: true,
        withCredentials: this.options.withCredentials,
        observe: 'events',
        headers,
      })
      .pipe(takeUntil(merge(this.cancel$, this.destroyed$)));
  }

  /**
   * create upload body which will should be send
   */
  private createUploadBody(): FormData | File {
    if (this.options.transferMethod === 'formdata') {
      const formData = new FormData();
      this.model.files.forEach((file) => {
        formData.append('files', file.raw, file.name);
      });

      // add form controls
      for (const [name, ctrl] of this.form.controls()) {
        if (ctrl.send === false) {
          continue;
        }
        formData.append(name, JSON.stringify(ctrl.value));
      }
      return formData;
    }

    // we have to add header how the file is named
    // since transfer method is body we can only upload 1 file
    return this.model.files[0].raw;
  }

  /**
   * create upload request headers
   */
  private createUploadHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    /** if transfer method is body send all form data through headers */
    if (this.options.transferMethod === 'body') {
      for (const [name, ctrl] of this.form.controls()) {
        if (ctrl.send === false) {
          continue;
        }

        let headerName = name;
        if (this.options.formControlNameToKebabCase) {
          headerName = name
            // transform fooBar to Foo-Bar-
            .replace(/(?:(\w)([^A-Z]+))/g, (_full, first, rest) => {
              return first.toUpperCase().concat(rest, '-');
            })
            // remove trailing -
            .slice(0, -1);
        }
        headers = headers.append(headerName, JSON.stringify(ctrl.value));
      }
    }

    if (this.headers.authorization) {
      headers = this.createAuthroizationHeader(headers);
    }

    /** add additional headers which should send */
    Object.keys(this.headers)
      .filter((header) => header !== 'authorization')
      .forEach((header) => (headers = headers.append(header, this.headers[header] as string)));

    return headers;
  }

  /**
   * create authorization header which will send
   */
  private createAuthroizationHeader(headers: HttpHeaders): HttpHeaders {
    const authHeader = this.headers.authorization;
    if (authHeader) {
      if (typeof authHeader === 'string') {
        headers = headers.append('Authorization', `Bearer ${authHeader}`);
      } else {
        headers = headers.append('Authorization', `${authHeader.key ?? 'Bearer'} ${authHeader.token}`);
      }
    }
    return headers;
  }

  /**
   * request responds with an error
   */
  private handleError(response: HttpErrorResponse) {
    let errors: any[] = response.error instanceof ProgressEvent || response.status === 404 ? response.message : response.error;
    errors = Array.isArray(errors) ? errors : [errors];

    const uploadResponse: NgxFileUploadResponse = {
      success: false,
      body: null,
      errors,
    };

    this.model.state = NgxFileUploadState.COMPLETED;
    this.model.response = uploadResponse;
    this.model.hasError = true;
    this.notifyObservers();
  }

  /**
   * handle all http events
   */
  private handleHttpEvent(event: HttpEvent<string>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.handleProgress(event);
        break;

      case HttpEventType.Response:
        this.handleResponse(event);
        break;
    }
  }

  /**
   * handle http progress event
   */
  private handleProgress(event: HttpProgressEvent) {
    const loaded = event.loaded;
    const progress = (loaded * 100) / this.totalSize;
    this.model.state = NgxFileUploadState.PROGRESS;

    /**
     * for some reason the upload is sometimes a bit bigger then the files,
     * pretty sure this happens because of headers which are send makes the request a bit
     * bigger
     */
    this.model.uploaded = Math.min(loaded, this.totalSize);
    this.model.progress = Math.min(Math.round(progress), 100);
    this.notifyObservers();
  }

  /**
   * upload completed with an success
   */
  private handleResponse(res: HttpResponse<any>) {
    const uploadResponse: NgxFileUploadResponse = {
      success: res.ok,
      body: res.body,
      errors: null,
    };

    this.model.response = uploadResponse;
    this.model.state = NgxFileUploadState.COMPLETED;
    this.notifyObservers();
    this.finalizeUpload();
  }

  /**
   * send notification to observers
   */
  private notifyObservers() {
    this.change$.next(this.data);
  }

  /**
   * upload has been completed, canceled or destroyed
   */
  private finalizeUpload() {
    this.change$.complete();
    this.cancel$.complete();
  }
}
