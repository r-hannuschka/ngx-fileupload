import { Component, Inject, OnInit, OnDestroy, Input } from "@angular/core";
import { UploadStorage, QueueState, UploadRequest, UploadData, UploadState, UploadModel } from "@r-hannuschka/ngx-fileupload";
import { takeUntil, takeWhile } from "rxjs/operators";
import { Subject, merge } from "rxjs";
import { ViewportControl } from "ngx-customscrollbar";

/** app specfic imports */
import { ExampleUploadStorage } from "@ngx-fileupload-example/data/base/upload-storage";

@Component({
    selector: "app-ui--upload-overview",
    templateUrl: "upload-overview.html",
    styleUrls: ["./upload-overview.scss"],
    viewProviders: [ViewportControl]
})
export class UploadOverviewComponent implements OnInit, OnDestroy {

    @Input()
    public title = "Uploads";

    public processing: UploadData[] = [];

    public pending: UploadData[] = [];

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

        this.storage.queueChange
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((state: QueueState) => {
                /**
                 * @todo improve we dont want to render this list again and again
                 */
                this.processing = state.processing.map((req) => req.data);
                this.pending    = state.pending.map((req) => req.data);

                /** register to processing uploads to get a change */
                if (this.processing.length) {
                    // do not register if not required
                    this.registerProcessState(state.processing);
                } else {
                    this.collapsed = true;
                }
            });
    }

    public remove(requestId: string) {
        this.storage.remove(requestId);
    }

    public toggleBody() {
        this.collapsed = !this.collapsed;
    }

    /**
     * register to active processes, if one completes we complete
     * this observeable and creates a new one if queue sends us
     * new values
     */
    private registerProcessState(req: UploadRequest[]) {
        merge(...req.map((_) => _.change))
            .pipe(
                takeWhile((upload) => (
                    upload.state !== UploadState.COMPLETED &&
                    upload.state !== UploadState.CANCELED
                )),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (model: UploadModel) => this.updateData(model.toJson())
            });
    }

    /**
     * find data in processing array and update only the data
     * this will prevent list from render again
     */
    private updateData(data: UploadData) {
        const processData = this.processing
            .filter((model) => model.requestId === data.requestId);

        Object.assign(processData[0], data);
    }
}
