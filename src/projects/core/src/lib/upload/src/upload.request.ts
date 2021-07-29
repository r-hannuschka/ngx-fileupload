import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpProgressEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Subject, Observable, merge, of, concat } from "rxjs";
import { takeUntil, filter, switchMap, map, tap, bufferCount } from "rxjs/operators";
import { NgxFileUploadState, NgxFileUploadResponse, INgxFileUploadRequest, NgxFileUploadOptions, INgxFileUploadRequestData } from "../../api";
import { NgxFileUploadFile } from "./upload.model";
import { NgxFileUploadRequestModel } from "./upload.request.model";

export class NgxFileUploadRequest implements INgxFileUploadRequest {

  private cancel$: Subject<boolean> = new Subject();
  private change$: Subject<INgxFileUploadRequestData> = new Subject();
  private destroyed$: Subject<boolean> = new Subject();
  private totalSize = -1;

  private options: NgxFileUploadOptions = {
    url: "",
    formData: { enabled: true, name: "file" }
  };

  private model: NgxFileUploadRequestModel;
  private hooks: { beforeStart: Observable<boolean>[] } = { beforeStart: [] };

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
    this.model.state = state;
  }

  get state(): NgxFileUploadState {
    return this.model.state;
  }

  requestId: string = "";

  constructor(
    private http: HttpClient,
    files: NgxFileUploadFile | NgxFileUploadFile[],
    options: NgxFileUploadOptions
  ) {
    this.model = new NgxFileUploadRequestModel(files)
    this.state = this.isInvalid() ? NgxFileUploadState.INVALID : NgxFileUploadState.IDLE
    this.options = { ...this.options, ...options }
  }

  public beforeStart(hook: Observable<boolean>) {
    this.hooks.beforeStart = [
      ...this.hooks.beforeStart,
      hook
    ];
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
    return this.state === NgxFileUploadState.INVALID || this.model.validationErrors !== null
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
    if (this.isRequestCompleted() && this.hasError() || this.isCanceled()) {
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

    this.beforeStartHook$.pipe(
      filter(isAllowedToStart => isAllowedToStart),
      tap(() => (this.model.state = NgxFileUploadState.START, this.notifyObservers())),
      switchMap(() => this.startUploadRequest()),
    ).subscribe({
      next: (event: HttpEvent<string>) => this.handleHttpEvent(event),
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  removeInvalidFiles() {
    if (this.state !== NgxFileUploadState.INVALID) {
      return;
    }

    const files = this.data.files.filter((file) => file.validationErrors === null)

    if (files.length) {
      this.model = new NgxFileUploadRequestModel(files)
      this.state = NgxFileUploadState.IDLE
      this.notifyObservers()
    } else {
      this.destroy()
    }
  }

  /**
   * call hooks in order, see playground
   * @see https://rxviz.com/v/58GkkYv8
   */
  private get beforeStartHook$(): Observable<boolean> {

    const initialState = this.model.state;
    let hook$: Observable<boolean> = of(true);
    if (this.hooks.beforeStart.length) {
      hook$ = concat(...this.hooks.beforeStart)
        .pipe(
          bufferCount(this.hooks.beforeStart.length),
          map((result) => result.every(isAllowed => isAllowed)),
          tap(() => this.model.state !== initialState ? this.notifyObservers() : void 0)
        );
    }
    return hook$;
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

    return this.http.post<string>(this.options.url, uploadBody, {
      reportProgress: true,
      observe: "events",
      headers
    }).pipe(
      takeUntil(merge(this.cancel$, this.destroyed$))
    );
  }

  /**
   * create upload body which will should be send
   */
  private createUploadBody(): FormData | File {
    if (this.options.formData?.enabled) {
      const formDataOptions = this.options.formData;
      const formData = new FormData();
      const label = formDataOptions.name ?? 'fileupload';

      this.model.files.forEach((file) => {
        formData.append(label, file.raw, file.name);
      })

      if (formDataOptions.metadata) {
        formData.append('metadata', JSON.stringify(formDataOptions.metadata));
      }
      return formData;
    }

    return this.model.files[0].raw;
  }

  /**
   * create upload request headers
   */
  private createUploadHeaders(): HttpHeaders | undefined {
    if (this.options.headers) {
      let headers = new HttpHeaders();

      if (this.options.headers.authorization) {
        headers = this.createAuthroizationHeader(headers);
      }

      /** add additional headers which should send */
      Object.keys(this.options.headers)
        .filter((header) => header !== "authorization")
        .forEach((header) => headers = headers.append(header, this.options.headers?.[header] as string));

      return headers;
    }
    return void 0;
  }

  /**
   * create authorization header which will send
   */
  private createAuthroizationHeader(headers: HttpHeaders): HttpHeaders {
    const authHeader = this.options.headers?.authorization;

    if (authHeader) {
      if (typeof authHeader === "string") {
        headers = headers.append("Authorization", `Bearer ${authHeader}`);
      } else {
        headers = headers.append("Authorization", `${authHeader.key || "Bearer"} ${authHeader.token}`);
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
      errors
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
      case HttpEventType.UploadProgress: this.handleProgress(event); break;
      case HttpEventType.Response: this.handleResponse(event); break;
    }
  }

  /**
   * handle http progress event
   */
  private handleProgress(event: HttpProgressEvent) {
    const loaded = event.loaded;
    const progress = loaded * 100 / this.totalSize;
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
      errors: null
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
