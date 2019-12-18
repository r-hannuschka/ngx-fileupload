import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
    selector: "ngx-file-upload-ui--progressbar",
    templateUrl: "progressbar.html",
    styleUrls: ["./progressbar.scss"]
})
export class ProgressbarComponent implements OnInit {

    public fullWidth = 0;

    public progressedWidth = 0;

    public dashArrayCSS = `1`;

    private progressbarParts = 80;

    private progressbarGap   = 1;

    @ViewChild('progressbar', {read: ElementRef, static: true})
    private progressbar: ElementRef<SVGElement>;

    @Input()
    public set gap(gap: number) {
        this.progressbarGap = gap;
    }

    @Input()
    public set parts(count: number) {
        this.progressbarParts = count;
    }

    @Input()
    public set progress(progress: number) {
        this.progressedWidth = progress * this.fullWidth / 100;
    }

    public ngOnInit() {
        /** svg width */
        const {width} = this.progressbar.nativeElement.getBoundingClientRect();

        /**
         * calculate dasharray
         */
        const widthWithoutGap = width - (this.progressbarParts * this.progressbarGap);
        const dashArrayWidth  = widthWithoutGap / this.progressbarParts;
        const dashArrayGap    = this.progressbarGap;
        this.dashArrayCSS     = `${dashArrayWidth} ${dashArrayGap}`;

        this.fullWidth = width;
    }
}
