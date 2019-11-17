import { CancelAblePipe, FileUpload, UploadState } from "@r-hannuschka/ngx-fileupload";
import { UploadModel } from "../../mockup/upload-model";

describe("ngx-fileupload/libs/utils", () => {

    let pipe: CancelAblePipe;
    let fileUpload: FileUpload;

    beforeEach(() => {
      pipe = new CancelAblePipe();
      fileUpload = new UploadModel();
    });

    describe("Cancelable Pipe", () => {

        it ("it should be cancelable if state is pending", () => {
            fileUpload.state = UploadState.PENDING;
            const result = pipe.transform(fileUpload);
            expect(result).toBeTruthy();
        });

        it ("it should be cancelable if state is progress", () => {
            fileUpload.state = UploadState.PROGRESS;
            const result = pipe.transform(fileUpload);
            expect(result).toBeTruthy();
        });

        it ("it should be cancelable if state is start", () => {
            fileUpload.state = UploadState.START;
            const result = pipe.transform(fileUpload);
            expect(result).toBeTruthy();
        });

        it ("it should not be cancelable if state on state canceled, completed, invalid and idle", () => {

            const states = [UploadState.CANCELED, UploadState.COMPLETED, UploadState.INVALID, UploadState.IDLE];

            const result: boolean[] = states.map((state: UploadState) => {
                fileUpload.state = state;
                return pipe.transform(fileUpload);
            });

            expect(result).toEqual([false, false, false, false]);
        });
    });
  });
