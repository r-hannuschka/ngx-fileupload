import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { By } from "@angular/platform-browser";

import {
    NgxFileUploadDirective,
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
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestItemComponent);
        testComponent = fixture.componentInstance;
    });

    it("should set file as invalid and remove it from list on clean all", () => {
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
