import { InjectionToken, Inject, Optional, Injectable } from "@angular/core";

export enum NgxFileUploadUiI18nKey {
    Common     = "common",
    UploadItem = "item",
    ToolBar    = "toolbar"
}

interface Labels {
    [key: string]: string;
}

export interface NgxFileUploadUiI18nCommon extends Labels {
    SELECT_FILES: string;
}

export interface NgxFileUploadUiI18nToolbar extends Labels {
    CLEAN_UP: string;
    REMOVE_ALL: string;
    UPLOAD_ALL: string;
    UPLOADS: string;
}

export interface NgxFileUploadUiI18nItem extends Labels {
    UPLOADED: string;
}

declare type NgxFileuploadI18nValue = NgxFileUploadUiI18nCommon | NgxFileUploadUiI18nItem | NgxFileUploadUiI18nToolbar | undefined;

/** all labels which exists */
export interface NgxFileUploadUiI18n {
    [key: string]: NgxFileUploadUiI18nCommon | NgxFileUploadUiI18nItem | NgxFileUploadUiI18nToolbar | undefined;
    common?: NgxFileUploadUiI18nCommon;
    item?: NgxFileUploadUiI18nItem;
    toolbar?: NgxFileUploadUiI18nToolbar;
}

/**
 * injection token
 */
export const NGX_FILE_UPLOAD_UI_I18N = new InjectionToken<NgxFileUploadUiI18n>("NgxFileUpload UI I18n labels");

@Injectable({providedIn: "root"})
export class NgxFileUploadUiI18nProvider {

    private labels: NgxFileUploadUiI18n;

    public constructor(
        @Optional() @Inject(NGX_FILE_UPLOAD_UI_I18N) labels: NgxFileUploadUiI18n
    ) {
        this.labels = labels || {};
    }

    public getI18n<T extends NgxFileuploadI18nValue>(k: NgxFileUploadUiI18nKey): T {
        return this.labels[k.toString()] as T;
    }
}
