
import { CommonModule } from "@angular/common";
import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { UploadToolbarComponent, UploadStorage, UploadRequest, UploadState } from "projects/ngx-fileupload/public-api";
import { By } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { debounceTime, take } from "rxjs/operators";
import { UploadRequestMock, UploadModel } from "../../mockup";

describe( "ngx-fileupload/libs/ui/upload-toolbar:", () => {

    let storage: UploadStorage;
    let fixture: ComponentFixture<UploadToolbarComponent>;
    let testComponent: UploadToolbarComponent;
    const changeMock: Subject<UploadRequest[]> = new Subject();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
            ],
            declarations: [
                UploadToolbarComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        storage = new UploadStorage();
        spyOn(storage, "change").and.returnValue(changeMock.asObservable());

        fixture = TestBed.createComponent(UploadToolbarComponent);

        testComponent = fixture.componentInstance;
        testComponent.storage = storage;
        testComponent.ngOnInit();
    });

    it("should contain upload all button", () => {
        expect(fixture.debugElement.query(By.css(".actions button.upload-all"))).not.toBeNull();
    });

    it("upload button should be disabled", () => {
        fixture.detectChanges();
        const uploadAllButton = fixture.debugElement.query(By.css(".actions button.upload-all"));
        expect(uploadAllButton.nativeElement.disabled).toBeTruthy();
    });

    it("upload button should be enabled if one idle item is in list", (done) => {

        const uploadFile = new UploadModel();
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const uploadAllButton = fixture.debugElement.query(By.css(".actions button.upload-all"));
                expect(uploadAllButton.nativeElement.disabled).toBeFalsy();
                done();
            });

        changeMock.next([upload]);
    });

    it("upload button should be disabled if no idle uploads in list", (done) => {

        const uploadFile = new UploadModel();
        uploadFile.state = UploadState.PENDING;
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const uploadAllButton = fixture.debugElement.query(By.css(".actions button.upload-all"));
                expect(uploadAllButton.nativeElement.disabled).toBeTruthy();
                done();
            });

        changeMock.next([upload]);
    });

    it("upload button should call start all on storage", (done) => {
        const spy = spyOn(storage, "startAll").and.returnValue(void 0);
        const uploadFile = new UploadModel();
        const upload = new UploadRequestMock(uploadFile);

        fixture.detectChanges();
        changeMock.next([upload]);
        const uploadAllButton = fixture.debugElement.query(By.css(".actions button.upload-all"));

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                uploadAllButton.nativeElement.click();
                expect(spy).toHaveBeenCalled();
                done();
            });

        changeMock.next([upload]);
    });

    it("should contain purge button", () => {
        expect(fixture.debugElement.query(By.css(".actions button.clean"))).not.toBeNull();
    });

    it("purge button should be disabled if no completed or invalid upload in storage", (done) => {

        const uploadFile = new UploadModel();
        uploadFile.state = UploadState.PENDING;
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const purgeBtn = fixture.debugElement.query(By.css(".actions button.clean"));
                expect(purgeBtn.nativeElement.disabled).toBeTruthy();
                done();
            });

        changeMock.next([upload]);
    });

    it("purge button should be enabled an completed or invalid upload in storage", (done) => {
        const uploadFile = new UploadModel();
        uploadFile.state = UploadState.INVALID;
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const purgeBtn = fixture.debugElement.query(By.css(".actions button.clean"));
                expect(purgeBtn.nativeElement.disabled).toBeFalsy();
                done();
            });

        changeMock.next([upload]);
    });

    it("purge button should call purge on storage", (done) => {
        const spy = spyOn(storage, "purge").and.returnValue(void 0);
        const uploadFile = new UploadModel();
        uploadFile.state = UploadState.INVALID;
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const purgeBtn = fixture.debugElement.query(By.css(".actions button.clean"));
                purgeBtn.nativeElement.click();
                expect(spy).toHaveBeenCalled();
                done();
            });

        changeMock.next([upload]);
    });

    it("should contain remove all button", () => {
        expect(fixture.debugElement.query(By.css(".actions button.remove-all"))).not.toBeNull();
    });

    it("remove button should be disabled if no uploads in list", () => {
        fixture.detectChanges();
        const removeAllButton = fixture.debugElement.query(By.css(".actions button.remove-all"));
        expect(removeAllButton.nativeElement.disabled).toBeTruthy();
    });

    it("remove button should be enabled if any upload is in list", (done) => {
        const uploadFile = new UploadModel();
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const removeAllButton = fixture.debugElement.query(By.css(".actions button.remove-all"));
                expect(removeAllButton.nativeElement.disabled).toBeFalsy();
                done();
            });

        changeMock.next([upload]);
    });

    it("remove all button should call stopAll on storage", (done) => {

        const spy = spyOn(storage, "stopAll").and.returnValue(void 0);
        const uploadFile = new UploadModel();
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const removeAllButton = fixture.debugElement.query(By.css(".actions button.remove-all"));
                removeAllButton.nativeElement.click();
                expect(spy).toHaveBeenCalled();
                done();
            });

        changeMock.next([upload]);
    });

    it("purge and start all button should be disabled if all uploads are progressing", (done) => {
        const uploadFile = new UploadModel();
        uploadFile.state = UploadState.PROGRESS;
        const upload = new UploadRequestMock(uploadFile);
        fixture.detectChanges();

        storage.change()
            .pipe(
                debounceTime(20),
                take(1)
            )
            .subscribe(() => {
                fixture.detectChanges();
                const purgeBtn = fixture.debugElement.query(By.css(".actions button.clean"));
                purgeBtn.nativeElement.click();
                done();
            });

        changeMock.next([upload]);
    });
});
