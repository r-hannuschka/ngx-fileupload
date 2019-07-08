import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
    NgxFileUploadDirective,
    NgxFileUploadValidator,
    NGX_FILEUPLOAD_VALIDATOR,
    ValidationResult
} from "lib/public-api";

@Component({
    template: `
        <div class="fileupload" [ngxFileUpload]="url" (add)="onUploadsAdd($event)" #myNgxFileUploadRef='ngxFileUploadRef'>
    `
})
class TestItemComponent {

    public uploadUrl = "http://localhost/files/upload";
}

class MaxSizeValidator implements NgxFileUploadValidator {

    validate(file: File): ValidationResult {
        return {
            valid: false,
            error: "to big"
        };
    }
}

describe( "NgxFileUploadDirective:", () => {

    let fixture: ComponentFixture<TestItemComponent>;
    let testComponent: TestItemComponent;

    beforeAll(() => {
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

    it("should working", () => {
        fixture.detectChanges();
    });
});
