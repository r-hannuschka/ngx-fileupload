import { Component, Input } from "@angular/core";

export interface CanvasCircleProperties {

    /** svg height */
    height: number;

    /** svg width */
    width: number;

    /** circle radius */
    radius: number;
}

@Component({
    selector: "ngx-file-upload-ui--progressbar-circle",
    templateUrl: "progressbar-circle.html",
    styleUrls: ["./progressbar-circle.scss"]
})
export class ProgressbarCircleComponent {

    public data;

    @Input()
    public set circleData(data: CanvasCircleProperties) {
        const circumferences = 2 * Math.PI * data.radius;
        const offset = circumferences;
        const cx = data.width / 2;
        const cy = data.height / 2;

        this.data = Object.assign({}, data, {
            cx, cy, circumferences, offset, progress: 0
        });
    }

    @Input()
    set progress(progressed: number) {
        /** calculate new offset */
        const progressedOffset = ((100 - progressed) / 100) * this.data.circumferences;
        this.data = Object.assign({}, this.data, {
            offset: progressedOffset,
            progress: progressed
        });
    }
}
