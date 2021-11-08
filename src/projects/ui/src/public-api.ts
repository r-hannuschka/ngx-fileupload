/*
 * Public API Surface of @ngx-file-upload/ui
 */
export * from "./lib/ui.module";

export * from "./lib/common/main";
export * from "./lib/file-browser/main";
export * from "./lib/file-browser/src/file-browser";

export * from "./lib/progressbar/main";
export * from "./lib/progressbar/src/ui/progressbar";
export * from "./lib/progressbar/src/ui/progressbar-circle";

export * from "./lib/toolbar/main";
export * from "./lib/toolbar/src/toolbar";

export * from "./lib/upload-item/main";
export * from "./lib/upload-item/src/upload-item";
export * from "./lib/upload-item/src/upload.control";

export * from "./lib/common/src/cancelable.pipe"
export * from "./lib/common/src/file-size.pipe"
export * from "./lib/common/src/state-to-string.pipe"

export { NgxFileUploadUiI18n, NGX_FILE_UPLOAD_UI_I18N } from "./lib/i18n";
