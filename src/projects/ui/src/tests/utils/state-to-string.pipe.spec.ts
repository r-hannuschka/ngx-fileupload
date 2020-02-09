import { NgxFileUploadState } from "@ngx-file-upload/core";
import { StateToStringPipe } from "@ngx-file-upload/dev/ui/lib/common/src/state-to-string.pipe";

describe("ngx-file-upload/libs/utils/state-to-string.pipe", () => {

    let pipe: StateToStringPipe;

    beforeEach(() => {
      pipe = new StateToStringPipe();
    });

    it ("should return idle", () => {
        expect(pipe.transform(NgxFileUploadState.IDLE)).toBe("idle");
    });

    it ("should return pending", () => {
        expect(pipe.transform(NgxFileUploadState.PENDING)).toBe("pending");
    });

    it ("should return canceled", () => {
        expect(pipe.transform(NgxFileUploadState.CANCELED)).toBe("canceled");
    });

    it ("should return invalid", () => {
        expect(pipe.transform(NgxFileUploadState.INVALID)).toBe("invalid");
    });

    it ("should return progress", () => {
        expect(pipe.transform(NgxFileUploadState.PROGRESS)).toBe("progress");
    });

    it ("should return start", () => {
        expect(pipe.transform(NgxFileUploadState.START)).toBe("start");
    });

    it ("should return completed", () => {
        expect(pipe.transform(NgxFileUploadState.COMPLETED)).toBe("completed");
    });
  });
