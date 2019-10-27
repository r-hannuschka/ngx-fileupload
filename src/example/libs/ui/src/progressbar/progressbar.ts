import { Component, Input, ElementRef, OnInit } from "@angular/core";

@Component({
    selector: "app-ui--progressbar",
    templateUrl: "progressbar.html"
})
export class ProgressbarComponent implements OnInit {

    public width: number;

    public progressbarWidth = 0;

    public progressed = 0;

    @Input()
    public set progress(progress: number) {
        if (this.width) {
            this.progressbarWidth = this.width - (this.width * progress) / 100;
        }

        this.progressed = progress;
    }

    public constructor(
        private elementRef: ElementRef,
    ) {}

    public ngOnInit() {
        const el: HTMLElement = this.elementRef.nativeElement;
        this.width = el.getBoundingClientRect().width;
        this.progressbarWidth = this.width - (this.width * this.progressed) / 100;
    }
}
