# Ngx Fileuplad Build in Pipes

## IsCancelAblePipe 

Returns true if an upload is cancelable, this is the case if

- upload is pending
- upload is starting
- upload is in progress

```ts
interface CancelAblePipe extends PipeTransform {
    transform(upload: FileUpload): boolean;
}
```

@example

```html
<!-- pass UploadRequest into pipe -->
<button (click)="ctrl.stop()" [disabled]= "upload | isCancelAble" [class]="'btn.cancel btn-sm'">
    <i class="icon-left icon-canceled"></i>
</button>
```

---

## FileSizePipe 

Formats a number into a human readable string with a max precision of 2 and cut trailing zeros. All values will return as binary bytes 
KibiByte, MiByte in short value is divided by 1024.

for example all values in Byte: 

- 123.001 becomes 123 Byte
- 112.10  becomes 112.1 Byte
- 123.12  becomes 123.12 Byte

Possible size returned: 

- Byte
- KibiByte (Kb)
- MebiByte (Mb)
- GibiByte (Gb)

```ts
interface FileSizePipe extends PipeTransform {
    /**
     * 
     * @param size<number> size in byte
     * @returns string formatted size max precision 2
     */
    transform(size: number): string;
}
```

@example

```html
<div class="value text-truncate">{{upload.uploaded | fileSize}} / {{upload.size | fileSize}}</div>
```

---

## State to string pipe

Returns given state from FileUpload and transform it into a string, by default it will return "idle"

```ts
declare type State = "idle" | "pending" | "progress" | "completed" | "start" | "invalid" | "canceled";

interface StateToStringPipe extends PipeTransform {
    transform(state: UploadState): State;
}
```

@example

```html
<i [ngClass]="['ngx-fileupload-icon--' + (upload.state | stateToString)]"></i>
```
