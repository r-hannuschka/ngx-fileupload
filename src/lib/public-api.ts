/*
 * Public API Surface of ngx-fileupload
 */
export * from "./ngx-fileupload/ngx-file-upload.module";
export * from "./ngx-fileupload/libs/api";
export * from "./ngx-fileupload/libs/ui";
export * from "./ngx-fileupload/libs/upload";
export * from "./ngx-fileupload/libs/validation";
export * from "./ngx-fileupload/libs/utils";

export { UploadState } from "./ngx-fileupload/libs/api";

/** @deprecated use UploadState directly */
import * as UploadAPI from "./ngx-fileupload/libs/api/src/upload";
export const UploadApi = UploadAPI;
