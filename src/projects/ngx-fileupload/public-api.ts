/*
 * Public API Surface of ngx-fileupload
 */
export * from "./ngx-file-upload.module";
export * from "./src/libs/api";
export * from "./src/libs/ui";
export * from "./src/libs/upload";
export * from "./src/libs/validation";
export * from "./src/libs/utils";

/** @deprecated use UploadState directly */
import * as UploadAPI from "./src/libs/api/src/upload";
export const UploadApi = UploadAPI;
