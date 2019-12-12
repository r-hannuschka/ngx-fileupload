import { StateToStringPipe, UploadState } from "projects/ngx-fileupload/public-api";

describe("ngx-fileupload/libs/utils/state-to-string.pipe", () => {

    let pipe: StateToStringPipe;

    beforeEach(() => {
      pipe = new StateToStringPipe();
    });

    it ("should return idle", () => {
        expect(pipe.transform(UploadState.IDLE)).toBe("idle");
    });

    it ("should return pending", () => {
        expect(pipe.transform(UploadState.PENDING)).toBe("pending");
    });

    it ("should return canceled", () => {
        expect(pipe.transform(UploadState.CANCELED)).toBe("canceled");
    });

    it ("should return invalid", () => {
        expect(pipe.transform(UploadState.INVALID)).toBe("invalid");
    });

    it ("should return progress", () => {
        expect(pipe.transform(UploadState.PROGRESS)).toBe("progress");
    });

    it ("should return start", () => {
        expect(pipe.transform(UploadState.START)).toBe("start");
    });

    it ("should return completed", () => {
        expect(pipe.transform(UploadState.COMPLETED)).toBe("completed");
    });
  });
