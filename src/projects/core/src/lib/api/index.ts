import type { NgxFileuploadFormControl } from "./src/upload";
import {
    NgxFileUploadValidationFn,
    NgxFileUploadValidator,
} from "./src/validation";

export interface IDataNode {
    [key: string]: any;
}

export type NgxFileUploadValidation<TSource = File | NgxFileuploadFormControl> =
    | NgxFileUploadValidator
    | NgxFileUploadValidationFn<TSource>;

export * from "./src/upload";
export * from "./src/validation";
