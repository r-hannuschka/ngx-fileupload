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

    public dashArray = `1`;

    public maskId = Math.random().toString(32);

    private circleParts = 1;

    private circleGap = 1;

    public constructor() {}

    @ViewChild("progressbar", {read: ElementRef, static: true})
    private progressbar: ElementRef<SVGElement>;

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

    public ngOnInit() {
        /**
         * quick fix, by default if we add new elements it will work correctly without timeout
         * this problem only exists if data comes out of a storage so it will renders to fast it seems
         * and have no width / height.
         *
         * neither afterViewInit, zone.onStable was working for this issue, so i dont know
         * any good solution for this, except using timeout of 0 to ensure dom and is rendered correctly
         */
        setTimeout(() => this.initializeData(), 0);
    }

    private initializeData() {

        const {width, height} = this.progressbar.nativeElement.getBoundingClientRect();
        const sideLength  = Math.min(width, height);

        this.data.cx     = sideLength / 2;
        this.data.cy     = sideLength / 2;
        this.data.radius = this.data.radius || this.calcRadius(sideLength);
        this.data.circumferences = 2 * Math.PI * this.data.radius;

        this.updateOffset();
        this.calcDashArray();
    }

    /** calculate dasharray offset for mask */
    private updateOffset() {
        this.data.offset = ((100 - this.data.progress) / 100) * this.data.circumferences;
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
        const gap       = this.circleParts === 1 ? 0 : partWidth - Math.floor(partWidth) + this.circleGap;
        this.dashArray = `${partWidth - gap} ${gap}`;
    }
}
