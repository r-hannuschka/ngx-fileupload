import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2, NgZone } from "@angular/core";

@Component({
    selector: "ngx-file-upload-ui--progressbar",
    templateUrl: "progressbar.html",
    styleUrls: ["./progressbar.scss"]
})
export class ProgressbarComponent implements OnInit {

    public dashArrayCSS = `1`;

    @Input()
    public animate = true;

    @Input()
    public set duration(duration: number) {
        this.animationDuration = Math.max(duration, 0);
    }

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
            this.updateProgress(progress);
        }
    }

    private animationDuration = 250;

    private progressbarGap = 1;

    private progressBuffer: number[] = [];

    private isAnimated = false;

    private progressbarParts = 1;

    @ViewChild("progressbar", {read: ElementRef, static: true})
    private progressbar: ElementRef<SVGElement> | undefined;

    @ViewChild("progressLine", {read: ElementRef, static: true})
    private progressLine: ElementRef<SVGLineElement> | undefined;

    public constructor(
        private renderer: Renderer2,
        private zone: NgZone
    ) {}

    public ngOnInit() {
        const {width} = this.progressbar?.nativeElement.getBoundingClientRect() ?? { width: 0 };

        /** calculate dasharray */
        const gap = this.progressbarParts === 1 ? 0 : this.progressbarGap;
        const widthWithoutGap = width - (this.progressbarParts * gap);
        const dashArrayWidth  = Math.ceil(widthWithoutGap / this.progressbarParts);

        this.dashArrayCSS = `${dashArrayWidth} ${gap}`;
    }

    private updateProgress(progress: number) {

        if (this.animate) {
            this.isAnimated ? this.progressBuffer.push(progress) : this.animateProgress(progress);
            return;
        }

        if (this.progressLine) {
            const el = this.progressLine.nativeElement;
            this.renderer.setAttribute(el, "x2", `${progress}%`);
        }
    }

    /**
     * animate progress
     *
     * @see https://javascript.info/js-animation
     */
    private animateProgress(progress: number) {

        const start = performance.now();
        const self  = this;
        const el    = this.progressLine?.nativeElement;

        if (!el) {
            return;
        }

        const curProgress = progress; // new progress state
        const oldProgress = parseInt(el.getAttribute("x2") ?? '0', 10); // old progress state

        this.isAnimated = true;

        this.zone.runOutsideAngular(() => {

            // should add to service so we dont have to get this multiple times
            requestAnimationFrame(function animate(time) {

                // timeFraction goes from 0 to 1
                const timeFraction = Math.min((time - start) / self.animationDuration, 1);

                // const progress = 1 - Math.sin(Math.acos(timeFraction));
                const progressed = timeFraction;

                // set progressed state
                const progressDelta = curProgress - oldProgress;
                const newProgress   = oldProgress + (progressed * progressDelta);
                self.renderer.setAttribute(el, "x2", `${newProgress}%`);

                if (timeFraction < 1) {
                    requestAnimationFrame(animate);
                    return;
                }

                if (self.progressBuffer.length > 0) {
                    self.animateProgress(self.progressBuffer.shift() as number);
                    return;
                }

                self.isAnimated = false;
            });
        });
    }
}
