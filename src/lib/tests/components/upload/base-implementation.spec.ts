import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxFileUploadComponent } from "lib/ngx-fileupload/components/ngx-fileupload.component";
import { NgxFileUploadMockDirective } from "../../mock/ngx-fileupload.directive.mock";
import { NgxFileUploadItemMockComponent } from "../../mock/ngx-fileupload-item.component.mock";

@Component({
    template: `<ngx-fileupload [url]="url"></ngx-fileupload>`
})
class TestComponent {

    @ViewChild(NgxFileUploadComponent, { read: NgxFileUploadComponent, static: true})
    public ngxFileUploadComponent: NgxFileUploadComponent;

    public url = "http://localhost/file/upload";
}

describe( "Upload Component:", () => {

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;
    let uploadDirective: NgxFileUploadMockDirective;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
            ],
            declarations: [
                TestComponent,
                NgxFileUploadComponent,
                NgxFileUploadMockDirective,
                NgxFileUploadItemMockComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        testComponent = fixture.componentInstance;
        uploadDirective = fixture.debugElement.query(By.directive(NgxFileUploadMockDirective)).injector.get(NgxFileUploadMockDirective);
    });

    it("should pass url to upload directive", () => {
        fixture.detectChanges();
        expect(uploadDirective.url).toBe("http://localhost/file/upload");
    });
});
