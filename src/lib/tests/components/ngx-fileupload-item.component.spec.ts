
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { Component, HostListener, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgxFileUploadItemComponent, UploadModel, FileUploadItemContext } from "lib/public-api";
import { FileUploadMock } from "../mock/upload-file.mock";
import { By } from "@angular/platform-browser";
import { ToArrayPipe } from "lib/ngx-fileupload/libs/utils/to-array.pipe";

@Component({
    template: `
        <ng-template #itemTemplate let-upload="data">
            {{upload.name}}
            {{upload.size}}
        </ng-template>
        <ngx-fileupload-item *ngFor="let item of uploads" [upload]="item" [template]="itemTemplate"></ngx-fileupload-item>
    `
})
class TestItemComponent {

    public uploads: FileUploadMock[] = [];

    /**
     * we set this to any since i could send anything through template input
     * decorater even there is a type defined
     */
    public itemTemplate: any;

    @ViewChild("itemTemplate", {read: TemplateRef, static: true})
    public template: TemplateRef<FileUploadItemContext>;

    @HostListener("click")
    public onClick() {}
}

describe( "NgxFileUploadItemComponent:", () => {

    let fixture: ComponentFixture<TestItemComponent>;
    let testComponent: TestItemComponent;
    let fileUpload: FileUploadMock;
    let uploadModel: UploadModel;

    beforeAll(() => {
        const file  = new File(["hello world"], "upload.txt", { type: "text/plain"});
        uploadModel = new UploadModel(file);
        fileUpload  = new FileUploadMock(uploadModel);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                NgMathPipesModule,
            ],
            declarations: [
                TestItemComponent,
                NgxFileUploadItemComponent,
                ToArrayPipe
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestItemComponent);
        testComponent = fixture.componentInstance;
    });

    it("should use default item template by default", () => {
        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploadItemComponent = fixture.debugElement
            .query(By.css("ngx-fileupload-item"))
            .injector.get(NgxFileUploadItemComponent);

        expect(uploadItemComponent.itemTpl).toBeDefined();
    });

    it("should use default item template if we send true as template", () => {

        testComponent.uploads = [fileUpload];
        testComponent.itemTemplate = "affe";
        fixture.detectChanges();

        const uploadItemComponent = fixture.debugElement
            .query(By.css("ngx-fileupload-item"))
            .injector.get(NgxFileUploadItemComponent);

        expect(uploadItemComponent.itemTpl).toBeDefined();
    });

    it("should use custom template", () => {
        testComponent.uploads = [fileUpload];
        testComponent.itemTemplate = testComponent.template;
        fixture.detectChanges();

        const uploadItem = fixture.debugElement.query(By.css("ngx-fileupload-item"));
        const uploadItemComponent = uploadItem.injector.get(NgxFileUploadItemComponent);

        expect(uploadItemComponent.itemTpl).toBe(testComponent.template);
        expect(uploadItem.nativeElement.innerHTML).toContain("upload.txt");
    });

    it("should not pass click event", () => {
        testComponent.uploads = [fileUpload];
        fixture.detectChanges();

        const uploadItem = fixture.debugElement.query(By.css("ngx-fileupload-item"));
        const clickSpy   = spyOn(testComponent, "onClick");

        uploadItem.nativeElement.click();
        expect(clickSpy).not.toHaveBeenCalled();
    });
});
