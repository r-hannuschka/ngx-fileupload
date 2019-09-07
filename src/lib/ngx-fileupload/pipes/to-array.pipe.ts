import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: "toArray"})
export class ToArrayPipe implements PipeTransform {
    transform<T>(value: T): T[] {
        if (Array.isArray(value)) {
            return value;
        }
        return [value];
    }
}
