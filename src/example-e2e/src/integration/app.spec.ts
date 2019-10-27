import { getFileUpload } from "../support/app.po";

describe("ngx-fileupload example dashboard", () => {
  beforeEach(() => cy.visit("/"));

  it("should display contain fileupload field", () => {
    getFileUpload().should("exist");
  });
});
