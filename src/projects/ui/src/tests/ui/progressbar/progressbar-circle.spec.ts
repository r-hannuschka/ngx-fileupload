
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxFileUploadUiProgressbarModule, ProgressbarCircleComponent } from "@ngx-file-upload/dev/ui/public-api";
import { By } from "@angular/platform-browser";

@Component({
    template: `<ngx-file-upload-ui--progressbar-circle></ngx-file-upload-ui--progressbar-circle>`
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

    it("should show error if no data settings are set", () => {
        fixture.detectChanges();

        console.log(progressbar.nativeElement);

        // dash array should be width 0
    });
});
