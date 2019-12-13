import { CommonModule } from "@angular/common";
import { Component, HostListener, TemplateRef, ViewChild } from "@angular/core";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ValidationErrors} from "@ngx-file-upload/core";
import { StateToStringPipe, CancelAblePipe, FileSizePipe, UploadItemComponent, FileUploadItemContext } from "@ngx-file-upload/dev/ui/public-api";
import { UploadModel, UploadRequestMock } from "@ngx-file-upload/testing";

@Component({
    template: `
        <ng-template #itemTemplate let-upload="data">
            <div class="name">{{upload.name}}</div>
            <div class="size">{{upload.size}}</div>
            <div class="uploaded">{{upload.uploaded}}</div>
        </ng-template>
        <ngx-file-upload-item *ngFor="let item of uploads" [upload]="item" [template]="customTemplate"></ngx-file-upload-item>
    `
})
class TestItemComponent {

    public uploads: UploadRequestMock[] = [];

    /**
     * we set this to any since i could send anything through template input
     * decorater even there is a type defined
     */
    public customTemplate: any;

    @ViewChild("itemTemplate", {read: TemplateRef, static: true})
    public template: TemplateRef<FileUploadItemContext>;

    @HostListener("click")
    public onClick() {}
}

describe( "NgxFileUploadItemComponent:", () => {

    let fixture: ComponentFixture<TestItemComponent>;
    let testComponent: TestItemComponent;
    let fileUpload: UploadRequestMock;
    let uploadModel: UploadModel;

    beforeEach(async(() => {

        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
            ],
            declarations: [
                TestItemComponent,
                UploadItemComponent,
                StateToStringPipe,
                FileSizePipe,
                CancelAblePipe
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        uploadModel = new UploadModel();
        fileUpload  = new UploadRequestMock(uploadModel);

        fixture = TestBed.createComponent(TestItemComponent);
        testComponent = fixture.componentInstance;
    });

    it("should use default item template by default", () => {
        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploadItemComponent = fixture.debugElement
            .query(By.css("ngx-file-upload-item"))
            .injector.get(UploadItemComponent);

        expect(uploadItemComponent.itemTpl).toBeDefined();
    });

    it("should use default item template if we pass null", () => {
        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploadItemComponent = fixture.debugElement
            .query(By.css("ngx-file-upload-item"))
            .injector.get(UploadItemComponent);

        expect(uploadItemComponent.itemTpl).toBeDefined();
    });

    it("should use default item template if we send true as template", () => {

        testComponent.customTemplate = "anything else";
        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploadItemComponent = fixture.debugElement
            .query(By.css("ngx-file-upload-item"))
            .injector.get(UploadItemComponent);

        expect(uploadItemComponent.itemTpl).toBeDefined();
    });

    it("should use custom template", () => {
        testComponent.customTemplate = testComponent.template;
        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploadItem = fixture.debugElement.query(By.css("ngx-file-upload-item"));
        const uploadItemComponent = uploadItem.injector.get(UploadItemComponent);

        expect(uploadItemComponent.itemTpl).toBe(testComponent.template);
        expect(uploadItem.nativeElement.innerHTML).toContain("upload-file.txt");
    });

    it("should update template", () => {
        testComponent.customTemplate = testComponent.template;
        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        /** set progress to 20 */
        fileUpload.uploadFile.uploaded = 20;
        fileUpload.applyChange();
        fixture.detectChanges();

        const uploaded = fixture.debugElement.query(By.css("ngx-file-upload-item .uploaded"));
        expect(uploaded.nativeNode.textContent).toBe("20");
    });

    it("should show validation errors", () => {

        const validationErrors: ValidationErrors = {
            error1: "invalid file",
            error2: "invalid name"
        };

        fileUpload.uploadFile.validationErrors = validationErrors;

        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploaded = fixture.debugElement.queryAll(By.css("ngx-file-upload-item .upload-item--validation li"));
        expect(uploaded.length).toBe(2);

        const messages = uploaded.map((element) => element.nativeNode.textContent.trim());
        expect(messages).toEqual(["invalid file", "invalid name"]);
    });

    it("should not pass click event", () => {

        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploadItem = fixture.debugElement.query(By.css("ngx-file-upload-item"));
        const clickSpy   = spyOn(testComponent, "onClick");

        uploadItem.nativeElement.click();
        expect(clickSpy).not.toHaveBeenCalled();
    });
});
