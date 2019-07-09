import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";

import {
    NgxFileUploadDirective,
    FileUpload,
    UploadModel
} from "lib/public-api";

@Component({
    template: `
        <div class="fileupload" [ngxFileUpload]="url" (add)="onUploadsAdd($event)">
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
        file  = new File(["hello world"], "upload.txt", { type: "text/plain"});
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                HttpClientTestingModule
            ],
            declarations: [
                TestItemComponent,
                NgxFileUploadDirective
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
        const dropZone = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).nativeElement;
        dragDropFile(dropZone, file);
        expect(uploadsAdd).toHaveBeenCalled();
    });

    it("should create upload with file", () => {
        const uploads: FileUpload[] = [];
        fixture.detectChanges();

        // add spy on uploads add to get arguments
        spyOn(testComponent, "onUploadsAdd").and.callFake((...args: FileUpload[][]) => {
            uploads.push(...args[0]);
        });

        // drop file to simulate create an upload
        const dropZone = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).nativeElement;
        dragDropFile(dropZone, file);

        expect(uploads.length).toBe(1);

        uploads[0].change.subscribe((value: UploadModel) => {
            expect(value.file).toBe(file);
        });
    });

    it("should start all uploads", () => {
        const uploads: FileUpload[] = [];
        fixture.detectChanges();

        // add spy on uploads add to get arguments
        spyOn(testComponent, "onUploadsAdd").and.callFake((...args: FileUpload[][]) => {
            uploads.push(...args[0]);
        });

        // drop file to simulate create an upload
        const dropZone = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).nativeElement;
        dragDropFile(dropZone, file);

        const myUpload = uploads[0];
        const start  = spyOn(myUpload, "start").and.callFake(() => {});
        const directive = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).injector.get(NgxFileUploadDirective);
        directive.uploadAll();

        expect(start).toHaveBeenCalled();
    });

    it("should cancel all uploads", () => {
        const uploads: FileUpload[] = [];
        fixture.detectChanges();

        // add spy on uploads add to get arguments
        spyOn(testComponent, "onUploadsAdd").and.callFake((...args: FileUpload[][]) => {
            uploads.push(...args[0]);
        });

        // drop file to simulate create an upload
        const dropZone = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).nativeElement;
        dragDropFile(dropZone, file);

        const myUpload  = uploads[0];
        const cancel    = spyOn(myUpload, "cancel").and.callFake(() => {});
        const directive = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).injector.get(NgxFileUploadDirective);
        directive.cancelAll();

        expect(cancel).toHaveBeenCalled();
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
