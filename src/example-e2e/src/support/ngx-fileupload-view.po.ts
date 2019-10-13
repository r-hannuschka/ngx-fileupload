export const getFileUpload = () => cy.get("ngx-fileupload");

export const getDropZone = () => cy.get("ngx-fileupload .fileupload");

export const getFileUploadItem = () => cy.get("ngx-fileupload ngx-fileupload-item");

export const getUploadButton  = () => cy.get("ngx-fileupload button.upload-action--upload");
export const getCancelButton  = () => cy.get("ngx-fileupload button.upload-action--cancel");
export const getCleanUpButton = () => cy.get("ngx-fileupload button.upload-action--clean");
