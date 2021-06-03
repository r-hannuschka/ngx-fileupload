import { Component, Input, ViewChild, ElementRef, OnInit, NgZone } from "@angular/core";

class ProgressbarCircleData {
    radius = 0;
    circumferences = 0;
    offset = 0;
    progress = 0;
}

@Component({
    selector: "ngx-file-upload-ui--progressbar-circle",
    templateUrl: "progressbar-circle.html",
    styleUrls: ["./progressbar-circle.scss"]
})
export class ProgressbarCircleComponent implements OnInit {

    public data: ProgressbarCircleData = new ProgressbarCircleData();

    public dashArray = `1`;

    public maskId = Math.random().toString(32);

    private circleParts = 1;

    private circleGap = 1;

    @ViewChild("progressbar", {read: ElementRef, static: true})
    private progressbar: ElementRef<SVGElement> | undefined;

    @Input()
    public set radius(radius: number) {
        this.data.radius = radius;
    }

    @Input()
    public set parts(parts: number) {
        this.circleParts = Math.max(parts, 1);
    }

    @Input()
    public set gap(gap: number) {
        this.circleGap = Math.max(gap, 1);
    }

    @Input()
    set progress(progressed: number) {
        /** calculate new offset */
        this.data.progress = progressed;
        this.updateOffset();
    }

    public constructor(
        private zone: NgZone
    ) {}

    public ngOnInit() {
        this.initializeData(performance.now());
    }

    /**
     * initialize data, currently we running into a problem if data comes straight
     * from storage, then the css properties are not set correctly but element is allready
     * rendered. Seems it belongs to a document fragment but not the page / parent component.
     *
     * So we need to run into an loop to ensure we have all data we need, this loop will break
     * after 100ms to ensure we dont run into infinite loop and take what we have.
     *
     * Neither zone.onStable nor afterViewInit are working for me here. Maybe afterViewChecked but this
     * will trigger multiple times.
     *
     * @todo check for better ways to solve this without loop
     * @todo think about second option make size and radius mandatory could be bad for responsive design but will work without loop
     */
    private initializeData(start: number, time = 0) {

        if (!this.progressbar) {
            return;
        }

        debugger;

        const {width, height} = this.progressbar.nativeElement.getBoundingClientRect();
        const sideLength  = Math.min(width, height);

        // start work arround here, will only triggered if data comes from storage / cache
        if (!this.data.radius && sideLength === 0 && (time - start) / 100 < 1) {
            this.zone.runOutsideAngular(() => {
                requestAnimationFrame((ellapsed) => this.initializeData(start, ellapsed));
            });
        } else {
            this.data.radius = this.data.radius || this.calcRadius(sideLength) || 0;
            this.data.circumferences = 2 * Math.PI * this.data.radius;

            this.updateOffset();
            this.calcDashArray();
        }
    }

    /** calculate dasharray offset for mask */
    private updateOffset() {
        this.data.offset = ((100 - this.data.progress) / 100) * this.data.circumferences;
    }

    /**
     * calculate circle radius if no one is passed
     */
    private calcRadius(sideLength: number): number {

        if (sideLength === 0 || !this.progressbar || !this.progressbar.nativeElement) {
            return 0;
        }

        const svgElement: SVGElement = this.progressbar.nativeElement;
        const strokeProgressEl = svgElement.querySelector("circle.progress");
        const strokeBackgroundEl = svgElement.querySelector("circle.progress-bar");

        console.log(strokeProgressEl);
        console.log(strokeBackgroundEl);

        if (!strokeProgressEl || !strokeBackgroundEl) {
            return 0;
        }

        const strokeProgress   = getComputedStyle(strokeProgressEl).strokeWidth;
        const strokeBackground = getComputedStyle(strokeBackgroundEl).strokeWidth;
        const strokeWidth      = Math.max(parseFloat(strokeProgress), parseFloat(strokeBackground));

        return sideLength / 2 - (strokeWidth / 2);
    }

    private calcDashArray() {
        const partWidth = (this.data.circumferences / this.circleParts);
        const gap       = this.circleParts === 1 ? 0 : partWidth - Math.floor(partWidth) + this.circleGap;
        this.dashArray = `${partWidth - gap} ${gap}`;
    }
}
