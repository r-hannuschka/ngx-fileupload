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
        let bytes = isNaN(size as number) ? parseFloat(size.toString()) : size;
        let unit  = 0;

        while (bytes >= 1024 && this.units.length > unit) {
            bytes = bytes / 1024;
            unit++;
        }

        /**
         * sets a max precision to 2, remove trailing zeros, toFixed was not working
         * since this will fill up number with trailing zeros.
         *
         * steps:
         * 1. find all until this is not a .
         * 2. only match . if this is not followed by 2 zeros
         * 3. match any number
         * 4. match any char which is not a zero (0,1)
         *
         * will only works with numbers which will converted to string
         * and not with string
         *
         * @example
         * 123.001 becomes 123
         * 123.10 becomes 123.1
         * 123.01 becomes 123.01
         * 123.01231 becomes 123.01
         */
        const formatter = /^[^\.]+(\.(?!0{2})\d[^0]?)?/g;
        const total = bytes.toString().match(formatter)?.[0] ?? bytes.toString();
        return `${total} ${this.units[unit]}`;
    }
}
