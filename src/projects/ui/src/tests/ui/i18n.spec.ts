import { CommonModule } from "@angular/common";
import { By } from "@angular/platform-browser";
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { UploadToolbarComponent } from "@ngx-file-upload/dev/ui/lib/toolbar/src/toolbar";
import { NGX_FILE_UPLOAD_UI_I18N, NgxFileUploadUiI18n, UploadViewComponent, NgxFileUploadUiModule } from "../../public-api";
import { NgxFileUploadStorage, NgxFileUploadFactory } from "@ngx-file-upload/core";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgxFileuploadFactoryMock } from "@ngx-file-upload/testing";

const i18n: NgxFileUploadUiI18n = {
    common: {
        SELECT_FILES: "Drag da files here",
    },
    toolbar: {
        CLEAN_UP: "remove invalid / completed",
        REMOVE_ALL: "remove all uploads",
        UPLOADS: "upload states",
        UPLOAD_ALL: "start all uploads"
    }
};

describe( "I18N:", () => {

    describe("Toolbar", () => {

        let fixture: ComponentFixture<UploadToolbarComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                ],
                declarations: [
                    UploadToolbarComponent
                ],
                providers: [
                    { provide: NGX_FILE_UPLOAD_UI_I18N, useValue: i18n }
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UploadToolbarComponent);

            const storage = new NgxFileUploadStorage();
            const testComponent = fixture.componentInstance;
            testComponent.storage = storage;
            testComponent.ngOnInit();
        });

        it("should set label upload all button to: start all uploads", () => {
            fixture.detectChanges();
            const el: HTMLElement = fixture.debugElement.query(By.css(".actions .upload-all")).nativeElement;
            expect(el.textContent).toContain(i18n.toolbar.UPLOAD_ALL);
        });

        it("should set label remove button to: remove all uploads", () => {
            fixture.detectChanges();
            const el: HTMLElement = fixture.debugElement.query(By.css(".actions .remove-all")).nativeElement;
            expect(el.textContent).toContain(i18n.toolbar.REMOVE_ALL);
        });

        it("should set label clean button to: remove invalid / completed", () => {
            fixture.detectChanges();
            const el: HTMLElement = fixture.debugElement.query(By.css(".actions .clean")).nativeElement;
            expect(el.textContent).toContain(i18n.toolbar.CLEAN_UP);
        });

        it("should set label upload overview to: upload states", () => {
            fixture.detectChanges();
            const el: HTMLElement = fixture.debugElement.query(By.css(".info")).nativeElement;
            expect(el.textContent).toContain(i18n.toolbar.UPLOADS);
        });
    });

    describe("Common View", () => {

        let fixture: ComponentFixture<UploadViewComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule( {
                imports: [
                    CommonModule,
                    NoopAnimationsModule,
                    HttpClientTestingModule,
                    NgxFileUploadUiModule
                ],
                declarations: [
                ],
                providers: [{
                    provide: NgxFileUploadFactory,
                    useClass: NgxFileuploadFactoryMock,
                },
                { provide: NGX_FILE_UPLOAD_UI_I18N, useValue: i18n }
            ]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(UploadViewComponent);
        });

        it("should set label for file selector to: Drag da files here", () => {
            fixture.detectChanges();
            const el: HTMLElement = fixture.debugElement.query(By.css(".file-browser")).nativeElement;
            expect(el.textContent).toContain(i18n.common.SELECT_FILES);
        });
    });
});
