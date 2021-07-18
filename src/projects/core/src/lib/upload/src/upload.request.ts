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
import { NgxFileUploadState, NgxFileUploadResponse, NgxFileUploadRequest, NgxFileUploadOptions, NgxFileUploadRequestData } from "../../api";

/**
 * represents a single file upload
 */
export class NgxFileUpload implements NgxFileUploadRequest {

  private cancel$: Subject<boolean> = new Subject();
  private change$: Subject<NgxFileUploadRequestData> = new Subject();
  private destroyed$: Subject<boolean> = new Subject();

  private options: NgxFileUploadOptions = {
    url: "",
    formData: { enabled: true, name: "file" }
  };

  private hooks: { beforeStart: Observable<boolean>[] } = { beforeStart: [] };

  public get change(): Observable<NgxFileUploadRequestData> {
    return this.change$.asObservable();
  }

  public get destroyed(): Observable<boolean> {
    return this.destroyed$.asObservable();
  }

  public get data(): NgxFileUploadRequestData {
    return this.upload;
  }

  public requestId: string = "";

  /**
   * create NgxFileUploadRequest service
   */
  public constructor(
    private http: HttpClient,
    private upload: NgxFileUploadRequestData,
    options: NgxFileUploadOptions
  ) {
    this.options = { ...this.options, ...options };
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
  public cancel() {
    if (this.isProgress() || this.isPending()) {
      this.upload.state = NgxFileUploadState.CANCELED;
      this.notifyObservers();
      this.cancel$.next(true);
    }
  }

  public destroy() {
    this.finalizeUpload();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * return true if upload was not completed since the server
   * sends back an error response
   */
  public hasError(): boolean {
    return this.upload.state === NgxFileUploadState.COMPLETED && !this.upload.response?.success;
  }

  public isCompleted(ignoreError = false): boolean {
    let isCompleted = this.isRequestCompleted();
    isCompleted = isCompleted && (ignoreError || !this.hasError());
    isCompleted = isCompleted || this.upload.state === NgxFileUploadState.CANCELED;
    return isCompleted;
  }

  public isCanceled(): boolean {
    return this.upload.state === NgxFileUploadState.CANCELED;
  }

  public isInvalid(): boolean {
    return this.upload.state === NgxFileUploadState.INVALID;
  }

  public isProgress(): boolean {
    return this.upload.state === NgxFileUploadState.PROGRESS || this.upload.state === NgxFileUploadState.START;
  }

  public isPending(): boolean {
    return this.upload.state === NgxFileUploadState.PENDING;
  }

  public isIdle(): boolean {
    return this.upload.state === NgxFileUploadState.IDLE;
  }

  /** returns true if request has been completed even on error */
  public isRequestCompleted() {
    return this.upload.state === NgxFileUploadState.COMPLETED;
  }

  /**
   * restart download again
   * reset state, and reset errors
   */
  public retry() {
    if (this.isRequestCompleted() && this.hasError() || this.isCanceled()) {
      // @todo implement
      // this.upload = new NgxFileUploadModel(this.upload.raw);
      this.start();
    }
  }

  /**
   * start file upload
   */
  public start() {

    if (!this.isIdle() && !this.isPending()) {
      return;
    }

    this.beforeStartHook$.pipe(
      filter(isAllowedToStart => isAllowedToStart),
      tap(() => (this.upload.state = NgxFileUploadState.START, this.notifyObservers())),
      switchMap(() => this.startUploadRequest()),
    ).subscribe({
      next: (event: HttpEvent<string>) => this.handleHttpEvent(event),
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  /**
   * call hooks in order, see playground
   * @see https://rxviz.com/v/58GkkYv8
   */
  private get beforeStartHook$(): Observable<boolean> {

    const initialState = this.upload.state;
    let hook$: Observable<boolean> = of(true);
    if (this.hooks.beforeStart.length) {
      hook$ = concat(...this.hooks.beforeStart)
        .pipe(
          bufferCount(this.hooks.beforeStart.length),
          map((result) => result.every(isAllowed => isAllowed)),
          tap(() => this.upload.state !== initialState ? this.notifyObservers() : void 0)
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

    return this.http.post<string>(this.options.url, uploadBody, {
      reportProgress: true,
      observe: "events",
      headers
    }).pipe(
      takeUntil(merge(this.cancel$, this.destroyed$)),
      tap((data) => console.dir(data))
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

      this.upload.files.forEach((file) => {
        formData.append(label, file.raw, file.name);
      })

      if (formDataOptions.metadata) {
        formData.append('metadata', JSON.stringify(formDataOptions.metadata));
      }
      return formData;
    }

    return this.upload.files[0].raw;
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

    this.upload.state = NgxFileUploadState.COMPLETED;
    this.upload.response = uploadResponse;
    this.upload.hasError = true;
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
    const progress = loaded * 100 / this.upload.size;
    this.upload.state = NgxFileUploadState.PROGRESS;
    this.upload.uploaded = loaded;
    this.upload.progress = Math.min(Math.round(progress), 100);
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
    this.upload.response = uploadResponse;
    this.upload.state = NgxFileUploadState.COMPLETED;
    this.notifyObservers();
    this.finalizeUpload();
  }

  /**
   * send notification to observers
   */
  private notifyObservers() {
    this.change$.next({ ...this.upload });
  }

  /**
   * upload has been completed, canceled or destroyed
   */
  private finalizeUpload() {
    this.change$.complete();
    this.cancel$.complete();
  }
}
