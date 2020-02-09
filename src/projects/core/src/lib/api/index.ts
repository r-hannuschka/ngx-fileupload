import { NgxFileUploadValidator, NgxFileUploadValidationFn } from "./src/validation";

export interface IDataNode {
    [key: string]: any;
}

export type NgxFileUploadValidation = NgxFileUploadValidator | NgxFileUploadValidationFn;

export * from "./src/upload";
export * from "./src/validation";
