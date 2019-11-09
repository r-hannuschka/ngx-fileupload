const config = require("./protractor.conf").config;

config.capabilities = {
  browserName: "firefox"
};

exports.config = config;