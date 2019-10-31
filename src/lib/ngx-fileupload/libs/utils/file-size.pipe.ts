import { Pipe, PipeTransform } from "@angular/core";

/**
 * format byte value into human readable value
 *
 * @example
 * <span>{{1024 | fileSize}}</span>
 * // prints out 1Kb
 *
 */
@Pipe({
    name: "fileSize"
})
export class FileSizePipe implements PipeTransform {

    private units = ["Byte", "Kb", "Mb", "Gb"];

    transform(size: number): string {
        let bytes = isNaN(size) ? parseFloat(size.toString()) : size;
        let unit  = 0;

        while (bytes > 1024 && this.units.length > unit) {
            bytes = bytes / 1024;
            unit++;
        }
        return `${bytes.toFixed(2)} ${this.units[unit]}`;
    }
}
