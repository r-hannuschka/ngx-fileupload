import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { UploadStorage, FileUpload } from "@ngx-file-upload/core";
import { Subject } from "rxjs";
import { ViewportControl } from "ngx-customscrollbar";

/** app specfic imports */
import { ExampleUploadStorage } from "projects/example/libs/data/base/upload-storage";

@Component({
    selector: "app-ui--upload-overview",
    templateUrl: "upload-overview.html",
    styleUrls: ["./upload-overview.scss"],
    viewProviders: [ViewportControl]
})
export class UploadOverviewComponent implements OnInit, OnDestroy {

    @Input()
    public title = "Uploads";

    public processing: FileUpload[] = [];

    public pending: FileUpload[] = [];

    public collapsed = true;

    private destroy$: Subject<boolean> = new Subject();

    public constructor(
        @Inject(ExampleUploadStorage) private storage: UploadStorage
    ) {}

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
    }

    public ngOnInit() {

        /*
        this.storage.queueChange
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((state: QueueState) => {
                /**
                 * @todo improve we dont want to render this list again and again
                 *
                this.processing = state.processing.map((req) => req.uploadFile);
                this.pending    = state.pending.map((req) => req.uploadFile);

                /** register to processing uploads to get a change *
                if (this.processing.length) {
                    // do not register if not required
                    this.registerProcessState(state.processing);
                } else {
                    this.collapsed = true;
                }
            });
            */
    }

    public remove(requestId: string) {
        this.storage.remove(requestId);
    }

    public toggleBody() {
        this.collapsed = !this.collapsed;
    }
}
