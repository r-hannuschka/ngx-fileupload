import { Validator, ValidationErrors } from "@ngx-file-upload/core";

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
        if (file.size / this.maxSize > 1) {
            return {
                maxFileSizeValidator: `max file size ${this.toUnits(this.maxSize)}`
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

        return `${totalSize.toFixed(2)} ${this.units[unitIndex]}`;
    }
}
