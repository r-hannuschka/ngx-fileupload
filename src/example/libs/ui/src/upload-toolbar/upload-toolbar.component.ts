import { Component, Output, Input, EventEmitter } from "@angular/core";
import { Upload, Validator } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-ui--upload-toolbar",
    templateUrl: "upload-toolbar.component.html"
})
export class UploadToolbarComponent {

    @Input()
    validator: Validator;

    @Input()
    url: string;

    @Output()
    add: EventEmitter<Upload[]> = new EventEmitter();

    @Output()
    completed: EventEmitter<Upload> = new EventEmitter();

    public onUploadAdd(uploads: Upload[]) {
        this.add.emit(uploads);
    }

    public uploadCompleted(upload: Upload) {
        this.completed.emit(upload);
    }
}
