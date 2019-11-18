import { FileSizePipe } from "@r-hannuschka/ngx-fileupload";

describe("ngx-fileupload/libs/utils/file-size.pipe", () => {

    let pipe: FileSizePipe;

    beforeEach(() => {
      pipe = new FileSizePipe();
    });

    it ("should convert 1024 into 1 Kb", () => {
        const num = pipe.transform(1024);
        expect(num).toBe("1 Kb");
    });

    it ("should convert 1024 * 364 into 364 Kb", () => {
        const num = pipe.transform(1024 * 364);
        expect(num).toBe("364 Kb");
    });

    it ("should convert 1024 ^ 2 into 1 Mb", () => {
        const num = pipe.transform(Math.pow(1024, 2));
        expect(num).toBe("1 Mb");
    });

    it ("should convert 1024 ^ 3 into 1 Gb", () => {
        const num = pipe.transform(Math.pow(1024, 3));
        expect(num).toBe("1 Gb");
    });

    it ("should convert 1024 ^ 3 + 512 * 1024 * 1024 into 1.5 GiB", () => {
        const mb = Math.pow(1024, 2) * 512; // 1MB * 512 = 512MB
        const gb = Math.pow(1024, 3); // 1 GB
        expect(pipe.transform(gb + mb)).toBe("1.5 Gb");
    });

    it ("should get max 2 precision", () => {
        const result = (1024 * 1024 * .5) / 3; // 512 : 3 = 170.666666666...
        expect(pipe.transform((.5 * 1024 * 1024) / 3)).toEqual(`170.66 Kb`);
    });
  });
