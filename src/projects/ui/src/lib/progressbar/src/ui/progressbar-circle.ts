import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";

export interface CanvasCircleProperties {
    /** circle radius */
    radius: number;
}

class ProgressbarCircleData {
    radius = 0;
    cx = 50;
    cy = 50;
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

    public renderAble = false;

    public dashArray = `1`;

    public isReady = false;

    private circleParts = 1;

    private circleGap = 1;

    public constructor(
    ) {}

    @ViewChild("progressbar", {read: ElementRef, static: true})
    private progressbar: ElementRef<SVGElement>;

    @Input()
    public set radius(radius: number) {
        this.data.radius = radius;
        this.updateData();
    }

    @Input()
    public set parts(parts: number) {
        this.circleParts = Math.max(parts, 1);
    }

    @Input()
    public set gap(gap: number) {
        this.circleGap = Math.max(gap, 0);
    }

    @Input()
    set progress(progressed: number) {
        /** calculate new offset */
        const progressedOffset = ((100 - progressed) / 100) * this.data.circumferences;
        this.data.offset = progressedOffset;
        this.data.progress = progressed;
    }

    public ngOnInit() {
    }

    public ngOnAfterViewInit() {
        this.initializeData();
        this.isReady = true;
    }

    private initializeData() {

        const {width, height} = this.progressbar.nativeElement.getBoundingClientRect();
        const sideLength  = Math.min(width, height);

        console.log(sideLength);

        this.data.cx     = sideLength / 2;
        this.data.cy     = sideLength / 2;
        this.data.radius = this.data.radius || this.calcRadius(sideLength);

        this.updateData();

        this.calcDashArray();
    }

    private updateData() {
        this.data.circumferences = 2 * Math.PI * this.data.radius;
        this.data.offset = this.data.circumferences;
    }

    /**
     * calculate circle radius if no one is passed
     */
    private calcRadius(sideLength): number {
        const strokeProgress   = getComputedStyle(this.progressbar.nativeElement.querySelector("circle.progress")).strokeWidth;
        const strokeBackground = getComputedStyle(this.progressbar.nativeElement.querySelector("circle.progress-bar")).strokeWidth;
        const strokeWidth      = Math.max(parseFloat(strokeProgress), parseFloat(strokeBackground));

        return sideLength / 2 - (strokeWidth / 2);
    }

    private calcDashArray() {

        const partWidth = (this.data.circumferences / this.circleParts);
        const gap       = partWidth - Math.floor(partWidth) + this.circleGap;
        this.dashArray = `${partWidth - gap} ${gap}`;
    }
}
