
import { ComponentFixture, async, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxFileUploadUiProgressbarModule, ProgressbarCircleComponent } from "@ngx-file-upload/dev/ui/public-api";
import { By } from "@angular/platform-browser";

@Component({
    template: `
        <style>
            ngx-file-upload-ui--progressbar-circle {
                height: 200px;
                width: 200px;
                display: block;
            }
        </style>
        <ngx-file-upload-ui--progressbar-circle></ngx-file-upload-ui--progressbar-circle>
    `
})
class TestItemComponent {
}

describe( "ngx-file-upload/libs/ui/progressbar-circle", () => {

    let fixture: ComponentFixture<TestItemComponent>;
    let progressbar: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                NgxFileUploadUiProgressbarModule
            ],
            declarations: [
                TestItemComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestItemComponent);
        progressbar = fixture.debugElement.query(By.directive(ProgressbarCircleComponent));
    });

    it("should render 4 circle elements (2 mask, 2 progressbars)", () => {
        fixture.detectChanges();
        const circles = progressbar.queryAll(By.css("circle"));
        expect(circles.length).toEqual(4);
    });

    it("should set correct dimensions", () => {
        fixture.detectChanges();

        const circle = progressbar.query(By.css("circle"));
        const {r, cx, cy} = circle.attributes;
        const {strokeWidth} = getComputedStyle(circle.nativeElement);
        const radius    = 100 - parseInt(strokeWidth, 10) / 2;
        // dasharray are circumferences and 0 with only one part
        const dashArray = `${2 * radius * Math.PI} 0`;

        expect(cx).toEqual("100");
        expect(cy).toEqual("100");
        expect(r).toEqual(radius.toString());
        expect(circle.attributes["stroke-dasharray"]).toEqual(dashArray);
    });

    it("should render radius of 40", () => {
        progressbar.componentInstance.radius = 40;
        fixture.detectChanges();
        const circle = progressbar.query(By.css("circle"));
        const {r} = circle.attributes;
        expect(r).toEqual("40");
    });

    it("should render 2 parts", () => {
        progressbar.componentInstance.radius = 40;
        progressbar.componentInstance.parts = 2;

        fixture.detectChanges();

        const circumFerences = 80 * Math.PI;
        const partWidth      = circumFerences / 2;
        const circle = progressbar.query(By.css("circle.progress"));

        // extract rest of division for part width, so we get integer value for first
        // value of dash array
        const rest = partWidth % Math.floor(partWidth);
        const dashArray      = `${partWidth - rest - 1} ${rest + 1}`;
        expect(circle.attributes["stroke-dasharray"]).toEqual(dashArray);
    });

    it("should render 2 parts with a gap of 2", () => {
        progressbar.componentInstance.radius = 40;
        progressbar.componentInstance.parts = 2;
        progressbar.componentInstance.gap = 2;

        fixture.detectChanges();

        const circumFerences = 80 * Math.PI;
        const partWidth      = circumFerences / 2;
        const circle = progressbar.query(By.css("circle.progress"));

        // extract rest of division for part width, so we get integer value for first
        // value of dash array
        const rest = partWidth % Math.floor(partWidth);
        const dashArray      = `${partWidth - rest - 2} ${rest + 2}`;
        expect(circle.attributes["stroke-dasharray"]).toEqual(dashArray);
    });

    it("should set progress", () => {
        progressbar.componentInstance.radius = 40;
        progressbar.componentInstance.parts = 2;
        progressbar.componentInstance.gap = 2;
        progressbar.componentInstance.progress = 20;

        fixture.detectChanges();

        const circumFerences = 80 * Math.PI;
        // this is a mask and filled completly, we only move dasharray offset back to zero
        const offset = circumFerences - circumFerences * 20 / 100;
        const circle = progressbar.query(By.css("mask circle.progress"));

        // extract rest of division for part width, so we get integer value for first
        // value of dash array
        expect(circle.attributes["stroke-dashoffset"]).toEqual(offset.toString());
    });

    it("should have initial side length of 0 but get 100 on second try ", fakeAsync(() => {
        progressbar.componentInstance.radius = 40;
        progressbar.componentInstance.parts = 2;
        progressbar.componentInstance.gap = 2;
        progressbar.componentInstance.progress = 20;

        progressbar.nativeElement.style.width = 0;
        progressbar.nativeElement.style.height = 0;

        fixture.detectChanges();

        // wait at least one frame
        // set now styles
        progressbar.nativeElement.style.width  = "200px";
        progressbar.nativeElement.style.height = "200px";

        // wait at least one frame
        tick(performance.now() + 16);
        fixture.detectChanges();

        const circle = progressbar.query(By.css("circle"));
        const {r, cx, cy} = circle.attributes;

        expect(cx).toEqual("100");
        expect(cy).toEqual("100");
        expect(r).toEqual("40");
    }));

    it("should have initial side length of 0 but get 100 on second try ", fakeAsync(() => {
        progressbar.componentInstance.parts = 2;
        progressbar.componentInstance.gap = 2;

        progressbar.nativeElement.style.width = 0;
        progressbar.nativeElement.style.height = 0;

        fixture.detectChanges();
        tick(performance.now() + 160);
        fixture.detectChanges();

        const circle = progressbar.query(By.css("circle"));
        const {r, cx, cy} = circle.attributes;

        expect(cx).toEqual("0");
        expect(cy).toEqual("0");
        expect(r).toEqual("0");
    }));
});
