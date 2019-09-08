import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import {
    NgxFileUploadDirective,
    FileUpload
} from "lib/public-api";
import { ValidatorMockFactory } from "../mock/validator.factory";
import { Validator } from "lib/ngx-fileupload/validation/validation";
import { By } from "@angular/platform-browser";

@Component({
    template: `
        <div class="fileupload" [ngxFileUpload]="uploadUrl" [validator]="validator" (add)="onUploadsAdd($event)">
    `
})
class TestItemComponent {

    public uploads: FileUpload[];

    public uploadUrl = "http://localhost/files/upload";

    public validator: Validator;

    public onUploadsAdd(uploads: FileUpload[]) {
        this.uploads = uploads;
    }
}

describe( "NgxFileUploadDirective NoValidator:", () => {

    let fixture: ComponentFixture<TestItemComponent>;
    let testComponent: TestItemComponent;
    let validFile: File;
    let invalidFile: File;

    beforeAll(() => {
        validFile   = new File(["hello world"], "valid", { type: "text/plain"});
        invalidFile = new File(["hello world, this is to much for me"], "invalid", { type: "text/plain"});
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

    it("should set file as invalid and remove it from list on clean all", () => {
        testComponent.validator = ValidatorMockFactory.invalid();
        fixture.detectChanges();

        // drop file to simulate create an upload
        const dropZone = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).nativeElement;
        dragDropFile(dropZone, [validFile]);

        const cancelValid   = spyOn(testComponent.uploads[0], "cancel").and.callFake(() => {});
        const directive     = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).injector.get(NgxFileUploadDirective);
        directive.cleanAll();
        expect(cancelValid).toHaveBeenCalled();
    });

    it("should not remove valid files on cancel all", () => {

        testComponent.validator = ValidatorMockFactory.byName("valid");
        fixture.detectChanges();

        // drop file to simulate create an upload
        const dropZone = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).nativeElement;
        dragDropFile(dropZone, [validFile, invalidFile]);

        const cancelValid   = spyOn(testComponent.uploads[0], "cancel").and.callFake(() => {});

        const directive     = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).injector.get(NgxFileUploadDirective);
        directive.cleanAll();

        expect(cancelValid).not.toHaveBeenCalled();
    });
});

function dragDropFile(target, files: File[]) {
    ["dragenter", "dragover", "drop"].forEach((name) => {
        const event: any = document.createEvent("MouseEvent");
        event.initMouseEvent( name, !0, !0, window, 0, 0, 0, 10, 10, !1, !1, !1, !1, 0, null );
        event.dataTransfer = {
            files
        };
        target.dispatchEvent(event);
    });
}
