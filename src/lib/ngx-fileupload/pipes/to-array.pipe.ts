import { Pipe, PipeTransform } from "@angular/core";

/**
 * very simple to array pipe to sanitize upload
 * error messages to array. By default we expect a single string
 * or an array of string to show upload errors to keep  this even
 * with validation errors. There could be multiple errors if we upload
 * a file and only one (server not responds ProgressEvent.message)
 * or maybe res.status(401).('not authorized to do all the cool things').
 */
@Pipe({name: "toArray"})
export class ToArrayPipe implements PipeTransform {
    transform<T>(value: T): T[] | T {
        if (Array.isArray(value)) {
            return value;
        }
        return [value];
    }
}
