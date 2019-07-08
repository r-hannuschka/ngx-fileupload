import { Component, TemplateRef, Input } from "@angular/core";
import { trigger, state, style, animate, transition, AnimationEvent } from "@angular/animations";
import { FileUpload } from "../services/file-upload";
import { UploadModel, UploadState } from "../model/upload";
import { Subject, of } from "rxjs";
import { take, delay, switchMap } from "rxjs/operators";

@Component({
    selector: "ngx-fileupload",
    styleUrls: ["./ngx-fileupload.component.scss"],
    templateUrl: "ngx-fileupload.component.html",
    animations: [
        trigger("removeUpload", [
            state("visible", style({ opacity: 1 })),
            transition(":leave" , [
                animate(".5s ease-out", style({ opacity: 0 }))
            ])
        ])
    ],
})
export class NgxFileUploadComponent {

    /**
     * optional pass diffrent itemtemplate
     */
    @Input()
    public itemTemplate: TemplateRef<any>;

    /**
     * input which url should be used to upload files,
     * this field is mandatory
     */
    @Input()
    public url: string;

    /**
     * if set to false upload post request body will use
     * plain file object in body
     */
    @Input()
    public useFormData = true;

    /**
     * form data field name with which form data will be send
     * by default this will be file
     */
    @Input()
    public formDataName = "file";

    /**
     * all file uploades, which will be added to upload-item view
     */
    public uploads: FileUpload[] = [];

    /**
     * subjects sends true if an animation has been done
     */
    private animation$: Subject<boolean> = new Subject();

    /**
     * triggers on animation done, if time used is 0
     * then this is a skipped animation (in this case :enter)
     * to avoid this fromState have to be visible to void
     * that means component leave animation has been completed
     *
     * @see https://github.com/angular/angular/issues/23535
     */
    public animationEnd($event: AnimationEvent) {
        if ($event.totalTime !== 0) {
            this.animation$.next(true);
        }
    }

    /**
     * new uploads added with drag and drop
     */
    public onUploadsAdd(uploads: FileUpload[]) {
        this.uploads.push(...uploads);
    }

    /**
     * handle upload change event,
     * if upload has been completed or canceled push them into remove queue
     */
    public handleUploadChange(upload: UploadModel, fileUpload: FileUpload) {
        if (upload.state === UploadState.CANCELED || upload.state === UploadState.UPLOADED) {
            this.removeUpload(fileUpload);
        }
    }

    /**
     * remove upload from list, this causes rerendering of the view
     * which emits true after animation has been done.
     */
    private removeUpload(upload: FileUpload) {
        of(upload).pipe(
            delay(1500),
            switchMap(() => {
                const idx = this.uploads.indexOf(upload);
                this.uploads.splice(idx, 1);
                return this.animation$.pipe(take(1));
            })
        )
        .subscribe();
    }
}
