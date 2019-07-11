import { ComponentFixture, async, TestBed, tick, fakeAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { UploadModel, NgxFileUploadComponent, UploadState } from "lib/public-api";
import { NgxFileUploadMockDirective } from "../mock/ngx-fileupload.directive.mock";
import { NgxFileUploadItemMockComponent } from "../mock/ngx-fileupload-item.component.mock";
import { FileUploadMock } from "../mock/upload-file.mock";

@Component({
    template: `<ngx-fileupload [url]="url"></ngx-fileupload>`
})
class BaseImplementationComponent {

    @ViewChild(NgxFileUploadComponent, { read: NgxFileUploadComponent, static: true})
    public ngxFileUploadComponent: NgxFileUploadComponent;

    public url = "http://localhost/file/upload";
}

describe( "Upload Component:", () => {

    let fixture: ComponentFixture<BaseImplementationComponent>;
    let testComponent: BaseImplementationComponent;
    let uploadDirective: NgxFileUploadMockDirective;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                NoopAnimationsModule
            ],
            declarations: [
                BaseImplementationComponent,
                NgxFileUploadComponent,
                NgxFileUploadMockDirective,
                NgxFileUploadItemMockComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseImplementationComponent);
        testComponent = fixture.componentInstance;
        uploadDirective = fixture.debugElement.query(By.directive(NgxFileUploadMockDirective)).injector.get(NgxFileUploadMockDirective);
    });

    it("should pass url to upload directive", () => {
        fixture.detectChanges();
        expect(uploadDirective.url).toBe("http://localhost/file/upload");
    });

    it("should pass useFormData true by default", () => {
        fixture.detectChanges();
        expect(uploadDirective.getUseFormData()).toBeTruthy();
    });

    it("should set useFormData to false", () => {
        testComponent.ngxFileUploadComponent.useFormData = false;
        fixture.detectChanges();
        expect(uploadDirective.getUseFormData()).toBeFalsy();
    });

    it("should pass formDataField as file by default", () => {
        fixture.detectChanges();
        expect(uploadDirective.getFormDataName()).toBe("file");
    });

    it("should pass custom formDataField", () => {
        const formDataFieldName = "images";
        testComponent.ngxFileUploadComponent.formDataName = formDataFieldName;
        fixture.detectChanges();
        expect(uploadDirective.getFormDataName()).toBe(formDataFieldName);
    });

    it("should add uploads", () => {
        const upload1 = new FileUploadMock() as any;
        const upload2 = new FileUploadMock() as any;

        testComponent.ngxFileUploadComponent.onUploadsAdd([upload1, upload2]);
        fixture.detectChanges();

        const uploadItems = fixture.debugElement.queryAll(By.css("ngx-fileupload-item"));
        expect(uploadItems.length).toBe(2);
    });

    it("should remove upload if uploaded", () => {
        const fileUpload  = new FileUploadMock() as any;
        const uploadModel = { state: "uploaded" } as UploadModel;
        testComponent.ngxFileUploadComponent.onUploadsAdd([fileUpload]);
        testComponent.ngxFileUploadComponent.handleUploadChange(uploadModel, fileUpload);
        fixture.detectChanges();
    });

    it("should remove upload if canceled", fakeAsync(() => {
        const fileUpload  = new FileUploadMock() as any;
        const uploadModel = { state: UploadState.CANCELED } as UploadModel;

        testComponent.ngxFileUploadComponent.onUploadsAdd([fileUpload]);
        testComponent.ngxFileUploadComponent.handleUploadChange(uploadModel, fileUpload);
        fixture.detectChanges();

        // debounce delay is 1500 ms, so wait for it
        tick(1500);
        expect(testComponent.ngxFileUploadComponent.uploads.length).toBe(0);
    }));

    it("should not remove upload if queued or progressing", () => {
        const fileUpload  = new FileUploadMock() as any;
        const uploadModel = { state: UploadState.QUEUED } as UploadModel;
        testComponent.ngxFileUploadComponent.onUploadsAdd([fileUpload]);
        testComponent.ngxFileUploadComponent.handleUploadChange(uploadModel, fileUpload);
        fixture.detectChanges();
    });
});
