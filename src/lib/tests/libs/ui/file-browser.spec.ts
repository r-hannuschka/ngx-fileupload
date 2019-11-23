import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";

import {
    FileBrowserDirective,
} from "@r-hannuschka/ngx-fileupload";

@Component({
    template: `
        <div class="fileupload" ngxFileUpload (add)="onUploadsAdd($event)">
    `
})
class TestItemComponent {

    public uploadUrl = "http://localhost/files/upload";

    public onUploadsAdd() {}
}

describe( "NgxFileUploadDirective NoValidator:", () => {

    let fixture: ComponentFixture<TestItemComponent>;
    let testComponent: TestItemComponent;
    let file: File;

    beforeAll(() => {
        file  = new File(["@r-hannuschka/ngx-fileupload"], "upload.txt", { type: "text/plain"});
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                HttpClientTestingModule
            ],
            declarations: [
                TestItemComponent,
                FileBrowserDirective
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestItemComponent);
        testComponent = fixture.componentInstance;
    });

    it("should trigger events on drag drop files and add uploads", () => {
        fixture.detectChanges();
        const uploadsAdd = spyOn(testComponent, "onUploadsAdd").and.callThrough();
        const dropZone = fixture.debugElement.query(By.directive(FileBrowserDirective)).nativeElement;
        dragDropFile(dropZone, file);
        expect(uploadsAdd).toHaveBeenCalled();
    });

    it("should not trigger files upload (drag/drop) if dropzone is disabled", () => {
        fixture.detectChanges();
        const uploadsAdd = spyOn(testComponent, "onUploadsAdd").and.callThrough();
        const dropZone  = fixture.debugElement.query(By.directive(FileBrowserDirective));
        const directive = dropZone.injector.get(FileBrowserDirective);

        directive.disabled = true;

        dragDropFile(dropZone.nativeElement, file);
        expect(uploadsAdd).not.toHaveBeenCalled();
    });

    /**
     * dont know how to test this private methods ...
     * this is just for code coverage it has been called ...
     */
    it("should not trigger", () => {

        fixture.detectChanges();
        const dropZone  = fixture.debugElement.query(By.directive(FileBrowserDirective));
        const directive = dropZone.injector.get(FileBrowserDirective);

        const event = new MouseEvent("click");

        directive.onClick(event);
        directive.disabled = true;
        directive.onClick(event);

    });
});

function dragDropFile(target, file) {
    ["dragenter", "dragover", "drop"].forEach((name) => {
        const event: any = document.createEvent("MouseEvent");
        event.initMouseEvent( name, !0, !0, window, 0, 0, 0, 10, 10, !1, !1, !1, !1, 0, null );
        event.dataTransfer = {
            files: [file]
        };
        target.dispatchEvent(event);
    });
}
