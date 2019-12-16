import { UploadState } from "@ngx-file-upload/core";
import { CancelAblePipe } from "@ngx-file-upload/dev/ui/lib/common/src/cancelable.pipe";

describe("ngx-file-upload/libs/utils/cancelable.pipe", () => {

    let pipe: CancelAblePipe;

    beforeEach(() => {
      pipe = new CancelAblePipe();
    });

    it ("it should be cancelable if state is pending", () => {
        const result = pipe.transform(UploadState.PENDING);
        expect(result).toBeTruthy();
    });

    it ("it should be cancelable if state is progress", () => {
        const result = pipe.transform(UploadState.PROGRESS);
        expect(result).toBeTruthy();
    });

    it ("it should be cancelable if state is start", () => {
        const result = pipe.transform(UploadState.START);
        expect(result).toBeTruthy();
    });

    it ("it should not be cancelable on state canceled, completed, invalid and idle", () => {
        const states = [UploadState.CANCELED, UploadState.COMPLETED, UploadState.INVALID, UploadState.IDLE];
        const result: boolean[] = states.map((state: UploadState) => {
            return pipe.transform(state);
        });

        expect(result).toEqual([false, false, false, false]);
    });
  });
