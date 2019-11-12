const config = require("./protractor.conf").config;

config.capabilities = {
  browserName: "firefox",
  "moz:firefoxOptions": {
    args: ["-headless"]
  }
};

exports.config = config;