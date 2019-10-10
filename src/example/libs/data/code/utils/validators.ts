export const IMAGE_VALIDATOR = `
import { ValidationErrors } from "@r-hannuschka/ngx-fileupload";

/**
 * defines a validation function which should return
 * ValidationErrors if invalid or Null if valid
 */
export function isImage(file: File): ValidationErrors {

    /**
     * very easy check, would be better to check for mime type
     */
    const valid = /\.(jpg|jpeg|gif|png)$/i.test(file.name);

    return !valid
        ? { isImage: "not a valid image file" }
        : null;
}`;

export const MAX_SIZE_VALIDATOR = `
import { Validator, ValidationErrors } from "@r-hannuschka/ngx-fileupload";

export class MaxUploadSizeValidator implements Validator {

    private units = ["Byte", "kb", "mb", "gb"];

    /**
     * default maxupload size 1Mb as byte
     */
    private maxSize: number;

    /**
     * constructor pass max upload size in byte
     */
    public constructor(size: number) {
        this.maxSize = size || 1024 * 1024;
    }

    public validate(file: File): ValidationErrors | null {
        const valid = (file.size / this.maxSize) < 1;

        if (file.size / this.maxSize > 1) {
            return {
                maxFileSizeValidator: 'max file size ' + this.toUnits(this.maxSize)
            };
        }
        return null;
    }

    private toUnits(size: number): string {
        let unitIndex = 0;
        let totalSize = size;

        while (totalSize > 1024 && unitIndex < this.units.length) {
            totalSize = totalSize / 1024;
            unitIndex++;
        }

        return totalSize.toFixed(2).concat(this.units[unitIndex]);
    }
}`;

export const IS_ZIP_VALIDATOR = `
import { ValidationErrors } from "@r-hannuschka/ngx-fileupload";

export function isZipFile(file: File): ValidationErrors | null {

    const validMime = [
        "application/zip",
        "application/octet-stream",
        "application/x-zip-compressed",
        "multipart/x-zip"
    ];

    let valid = validMime.some((type) => type === file.type);
    valid = valid && /\.zip$/.test(file.name);

    return !valid
        ? { zipValidator: "not a valid zip file" }
        : null;
}`;
