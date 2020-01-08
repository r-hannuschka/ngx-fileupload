import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2, NgZone } from "@angular/core";

@Component({
    selector: "ngx-file-upload-ui--progressbar",
    templateUrl: "progressbar.html",
    styleUrls: ["./progressbar.scss"]
})
export class ProgressbarComponent implements OnInit {

    public dashArrayCSS = `1`;

    @Input()
    public set gap(gap: number) {
        this.progressbarGap = Math.max(gap, 1);
    }

    @Input()
    public set parts(count: number) {
        this.progressbarParts = Math.max(count, 1);
    }

    @Input()
    public set progress(progress: number) {
        if (progress > 0) {
            this.progressBuffer.push(progress);

            if (!this.isAnimated) {
                this.updateProgress();
            }
        }
    }

    private progressbarGap = 0;

    private progressBuffer: number[] = [];

    private isAnimated = false;

    private progressbarParts = 1;

    @ViewChild('progressbar', {read: ElementRef, static: true})
    private progressbar: ElementRef<SVGElement>;

    @ViewChild('progressLine', {read: ElementRef, static: true})
    private progressLine: ElementRef<SVGLineElement>;

    public constructor(
        private renderer: Renderer2,
        private zone: NgZone
    ) {}

    public ngOnInit() {
        const {width} = this.progressbar.nativeElement.getBoundingClientRect();

        /** calculate dasharray */
        const widthWithoutGap = width - (this.progressbarParts * this.progressbarGap);
        const dashArrayWidth  = widthWithoutGap / this.progressbarParts;
        this.dashArrayCSS = `${dashArrayWidth} ${this.progressbarGap}`;
    }

    /**
     * animate progress
     * 
     * @see https://javascript.info/js-animation
     */
    public updateProgress() {

        const start = performance.now();
        const self  = this;
        const el    = this.progressLine.nativeElement;

        const tarProgress  = this.progressBuffer.shift(); // new progress state
        const oldProgress  = parseInt(el.getAttribute("x2"), 10); // old progress state

        this.isAnimated = true;

        this.zone.runOutsideAngular(() => {

            // should add to service so we dont have to get this multiple times
            requestAnimationFrame(function animate(time) {
                // timeFraction goes from 0 to 1
                let timeFraction = Math.min((time - start) / 250, 1);

                // const progress = 1 - Math.sin(Math.acos(timeFraction));
                const progress = timeFraction;

                // set progressed state
                const progressDelta = tarProgress - oldProgress;
                const newProgress   = oldProgress + (progress * progressDelta);
                self.renderer.setAttribute(el, "x2", `${newProgress}%`);

                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                    return;
                }

                if (self.progressBuffer.length > 0) {
                    self.updateProgress();
                    return;
                }

                self.isAnimated = false;
            });
        });
    }
}
