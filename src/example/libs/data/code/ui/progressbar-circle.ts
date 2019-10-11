export const HTML = `
<svg xmlns="http://www.w3.org/2000/svg" attr.width="{{data.height}}" attr.height={{data.height}}>
    <circle class="progress-bar" attr.r="{{data.radius}}" attr.cx="{{data.cx}}" attr.cy="{{data.cy}}" fill="transparent">
    </circle>

    <!-- progresssbar circle -->
    <circle class="progress"
        attr.r="{{data.radius}}"
        attr.cx="{{data.cx}}"
        attr.cy="{{data.cy}}"
        attr.stroke-dasharray="{{data.circumferences}}"
        attr.stroke-dashoffset="{{data.offset}}px"
        fill="transparent"
    >
    </circle>
    <text attr.x={{data.cx}} attr.y="{{data.cy}}" text-anchor="middle" font-size="1rem" fill="black">{{data.progress}} %</text>
</svg>
`;

export const TYPESCRIPT = `
import { Component, Input } from "@angular/core";
import { ProgressbarCircle } from "@ngx-fileupload-example/data";

@Component({
    selector: "app-ui--progressbar-circle",
    templateUrl: "progressbar-circle.component.html",
    styleUrls: ["./progressbar-circle.component.scss"]
})
export class ProgressbarCircleComponent {

    public data;

    @Input()
    public set circleData(data: ProgressbarCircle) {
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
`;

export const SCSS = `
:host {

    svg circle {
        transition: stroke-dashoffset .15s linear;
    }

    svg text {
        transform: translateY(calc(1rem / 2));
    }
}
`;
