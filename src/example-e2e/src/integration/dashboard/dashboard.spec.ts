import { getDropZone, getFileUpload, getFileUploadItem, getCleanUpButton, getUploadButton, getCancelButton } from "example-e2e/src/support/ngx-fileupload-view.po";

describe("ngx-fileupload example dashboard", () => {

  beforeEach(() => cy.visit("/"));

  describe("initial state", () => {

    it("should display contain fileupload field", () => {
      getFileUpload().should("exist");
    });

    it("should all buttons disabled", () => {
        getUploadButton().should("not.be.enabled");
        getCleanUpButton().should("not.be.enabled");
        getCancelButton().should("not.be.enabled");
    });
  });

  describe("upload items", () => {

      beforeEach((done) => {
        cy.fixture("files/ngx-fileupload.png", "base64")
          .then((file: string) => Cypress.Blob.base64StringToBlob(file, "image/png"))
          .then((blob) => new File([blob], "upload.png", {type: "image/png"}))
          .then((file) => {
              const dataTransfer = new DataTransfer();
              const items = dataTransfer.items;
              items.add(file);

              const dropEventData = {dataTransfer};
              return getDropZone().trigger("drop", dropEventData);
          })
          .then(() => done());
      });

      it("should add new file to upload list", () => {
          getFileUploadItem().should("have.length", 1);
      });

      it("should all buttons enabled", () => {
          getUploadButton().should("be.enabled");
          getCleanUpButton().should("be.enabled");
          getCancelButton().should("be.enabled");
      });

      it("should upload file into /dev/null", () => {

          getUploadButton().click({force: true});

          getFileUploadItem().get(".upload-item--state i")
            .should("have.class", "ngx-fileupload-icon--start")
            .then(item => {
                const iconEl = item.get(0);
                const states: string[] = [];
                let loops = 0;

                return new Promise((resolve) => {
                  const observer = new MutationObserver((mutations: MutationRecord[]) => {
                      const mutationEl = mutations[0].target as HTMLElement;
                      states.push(mutationEl.getAttribute("class"));

                      if (loops + 1 === 2) {
                          observer.disconnect();
                          resolve(states);
                      }
                      loops += 1;
                  });

                  observer.observe(iconEl, {
                      subtree: false,
                      attributes: true,
                      attributeFilter: ["class"]
                  });
                });
            })
            .then((value) => expect(value).to.deep.equal(
                ["ngx-fileupload-icon--progress", "ngx-fileupload-icon--uploaded"]
            ))
            .get(".upload-item--footer .message.success").then( _ => {
                return Promise.resolve(_.text().replace(/(^\s*|\s*$)/g, ""));
            })
            .then((value) => expect(value).to.be.equal("upload.png uploaded"));

            /**
             * all buttons have to been disabled
             */
          getUploadButton().should("not.be.enabled");
          getCleanUpButton().should("not.be.enabled");
          getCancelButton().should("not.be.enabled");
      });

      it("should cancel all uploads", () => {
          getCancelButton().click({force: true});

          getFileUploadItem()
            .get(".upload-item--state i")
            .then( _ => _.attr("class"))
            .then((className) => expect(className).to.be.equal("ngx-fileupload-icon--canceled"));

          getFileUploadItem()
            .wait(1000)
            .should("not.exist");
      });
  });
});
