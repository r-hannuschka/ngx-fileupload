// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  allScriptsTimeout: 11000,
  specs: [
    "./src/integration/**/*.spec.ts"
  ],
  capabilities: {
    "browserName": "chrome",
    "chromeOptions": {
        args: [
            "--window-size=800,600",
            // set log level to error
            "--log-level=0"
        ]
    },
  },

  directConnect: true,
  baseUrl: "http://localhost:4201/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: () => {}
  },
  onPrepare() {

    require("ts-node").register({
      project: require("path").join(__dirname, "./tsconfig.json")
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
