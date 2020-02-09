
import { ComponentFixture, async, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxFileUploadUiProgressbarModule, ProgressbarComponent } from "@ngx-file-upload/dev/ui/public-api";
import { By } from "@angular/platform-browser";

@Component({
    template: `<ngx-file-upload-ui--progressbar></ngx-file-upload-ui--progressbar>`
})
class TestItemComponent {

    public uploadUrl = "http://localhost/files/upload";

    public onUploadsAdd() {}
}

describe( "ngx-file-upload/libs/ui/progressbar", () => {

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
        progressbar = fixture.debugElement.query(By.directive(ProgressbarComponent));
    });

    it("should set dasharray for single progress to full width of svg", () => {
        fixture.detectChanges();

        const {width}   = getComputedStyle(progressbar.query(By.css("svg")).nativeElement);
        const dashArrayBackground = progressbar.query(By.css(".progressbar .progress")).styles["stroke-dasharray"];
        const dashArrayProgressbar = progressbar.query(By.css(".progressbar .progress")).styles["stroke-dasharray"];

        // dash array should be width 0
        expect(dashArrayBackground).toBe(`${parseInt(width, 10)}, 0`);
        expect(dashArrayProgressbar).toBe(`${parseInt(width, 10)}, 0`);
    });

    it("should set dasharray for 5 parts with 1px gap", () => {
        progressbar.nativeElement.style.width = "254px";

        (progressbar.componentInstance as ProgressbarComponent).gap = 1;
        (progressbar.componentInstance as ProgressbarComponent).parts = 5;

        fixture.detectChanges();

        const dashArrayBackground = progressbar.query(By.css(".progressbar .background")).styles["stroke-dasharray"];
        const dashArrayProgressbar = progressbar.query(By.css(".progressbar .progress")).styles["stroke-dasharray"];

        /** as we set to 254px width, 5 parts = 50px each, 4 time gap 1px each makes total of 254px */
        expect(dashArrayBackground).toBe(`50, 1`);
        expect(dashArrayProgressbar).toBe(`50, 1`);
    });

    it("should set dasharray ", () => {
        progressbar.nativeElement.style.width = "254px";

        (progressbar.componentInstance as ProgressbarComponent).gap = 1;
        (progressbar.componentInstance as ProgressbarComponent).parts = 5;

        fixture.detectChanges();

        const dashArrayBackground = progressbar.query(By.css(".progressbar .background")).styles["stroke-dasharray"];
        const dashArrayProgressbar = progressbar.query(By.css(".progressbar .progress")).styles["stroke-dasharray"];

        /** as we set to 254px width, 5 parts = 50px each, 4 time gap 1px each makes total of 254px */
        expect(dashArrayBackground).toBe(`50, 1`);
        expect(dashArrayProgressbar).toBe(`50, 1`);
    });

    it("should update progressed line if no progress is set", () => {
        const progressbarComponent = progressbar.componentInstance as ProgressbarComponent;

        // disable animation so result is directly visible
        progressbarComponent.animate = false;
        // set progress to 20%
        progressbarComponent.progress = 20;
        fixture.detectChanges();
        const x2 = progressbar.query(By.css(".progressbar .progress")).nativeElement.getAttribute("x2");
        expect(x2).toBe("20%");
    });

    it("should not update progressed line if no progress is set", () => {
        const progressbarComponent = progressbar.componentInstance as ProgressbarComponent;

        // disable animation so result is directly visible
        progressbarComponent.animate = false;
        // set progress to 20%
        progressbarComponent.progress = 0;
        fixture.detectChanges();
        const x2 = progressbar.query(By.css(".progressbar .progress")).nativeElement.getAttribute("x2");
        expect(x2).toBe("0");
    });

    it("should animate progress with a duration of 1 second", fakeAsync(() => {
        const progressbarComponent = progressbar.componentInstance as ProgressbarComponent;

        fixture.detectChanges();

        progressbarComponent.duration = 1000;
        progressbarComponent.progress = 20;
        tick(performance.now() + 1200);

        const x2 = progressbar.query(By.css(".progressbar .progress")).nativeElement.getAttribute("x2");
        expect(x2).toBe("20%");
    }));

    it("should use buffer to animate progressbar if animation allready running", fakeAsync(() => {
        const progressbarComponent = progressbar.componentInstance as ProgressbarComponent;

        fixture.detectChanges();

        // set animation duration to 1 sec
        progressbarComponent.duration = 1000;

        // set progress to 20%
        progressbarComponent.progress = 20;
        progressbarComponent.progress = 40;

        tick(performance.now() + 2100);
        const x2 = progressbar.query(By.css(".progressbar .progress")).nativeElement.getAttribute("x2");
        expect(x2).toBe("40%");
    }));
});
