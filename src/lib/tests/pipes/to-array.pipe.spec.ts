import { ToArrayPipe } from "lib/ngx-fileupload/utils/to-array.pipe";

describe("Pipe: ToArray", () => {
    let pipe: ToArrayPipe;

    beforeEach(() => {
      pipe = new ToArrayPipe();
    });

    it ("should convert value into an array", () => {
        const pipedResult = pipe.transform("hello world");
        expect(Array.isArray(pipedResult)).toBeTruthy();
        expect(pipedResult).toEqual(["hello world"]);
    });

    it ("should just return value if allready an array", () => {
        const pipedResult = pipe.transform(["hello world"]);
        expect(Array.isArray(pipedResult)).toBeTruthy();
        expect(pipedResult).toEqual(["hello world"]);
    });
  });
