import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";

import {
    NgxFileUploadDirective,
    NgxFileUploadValidator,
    ValidationResult,
    NGX_FILEUPLOAD_VALIDATOR,
    FileUpload
} from "lib/public-api";

@Component({
    template: `
        <div class="fileupload" [ngxFileUpload]="url" (add)="onUploadsAdd($event)">
    `
})
class TestItemComponent {

    public uploads: FileUpload[];

    public uploadUrl = "http://localhost/files/upload";

    public onUploadsAdd(uploads: FileUpload[]) {
        this.uploads = uploads;
    }
}

class NameValidator implements NgxFileUploadValidator {

    validate(file: File): ValidationResult {
        const valid = file.name !== "upload_invalid.txt";
        return { valid, error: !valid ? "invalid file uploaded" : ""};
    }
}

describe( "NgxFileUploadDirective NoValidator:", () => {

    let fixture: ComponentFixture<TestItemComponent>;
    let testComponent: TestItemComponent;
    let validFile: File;
    let invalidFile: File;

    beforeAll(() => {
        validFile   = new File(["hello world"], "upload_valid.txt", { type: "text/plain"});
        invalidFile = new File(["hello world, this is to much for me"], "upload_invalid.txt", { type: "text/plain"});
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
            ],
            providers: [{
                provide: NGX_FILEUPLOAD_VALIDATOR,
                useClass: NameValidator
            }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestItemComponent);
        testComponent = fixture.componentInstance;
    });

    it("should set file as invalid and remove it from list on clean all", () => {
        fixture.detectChanges();

        // drop file to simulate create an upload
        const dropZone = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).nativeElement;
        dragDropFile(dropZone, [validFile, invalidFile]);

        // get uploads
        expect(testComponent.uploads[1].isInvalid()).toBeTruthy();

        const cancelValid   = spyOn(testComponent.uploads[0], "cancel").and.callFake(() => {});
        const cancelInvalid = spyOn(testComponent.uploads[1], "cancel").and.callFake(() => {});
        const directive     = fixture.debugElement.query(By.directive(NgxFileUploadDirective)).injector.get(NgxFileUploadDirective);
        directive.cleanAll();

        expect(cancelInvalid).toHaveBeenCalled();
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
