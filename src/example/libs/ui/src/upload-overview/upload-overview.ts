import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { UploadStorage, QueueState, UploadRequest, UploadData, UploadState, UploadModel } from "@r-hannuschka/ngx-fileupload";
import { takeUntil, takeWhile } from "rxjs/operators";
import { Subject, merge } from "rxjs";

/** app specfic imports */
import { ExampleUploadStorage } from "@ngx-fileupload-example/data/base/upload-storage";

@Component({
    selector: "app-ui--upload-overview",
    templateUrl: "upload-overview.html",
    styleUrls: ["./upload-overview.scss"]
})
export class UploadOverviewComponent implements OnInit, OnDestroy {

    private destroy$: Subject<boolean> = new Subject();

    public processing: UploadData[] = [];

    public pending: UploadData[] = [];

    public constructor(
        @Inject(ExampleUploadStorage) private storage: UploadStorage
    ) {}

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
                }
            });
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
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
