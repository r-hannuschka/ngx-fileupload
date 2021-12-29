// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: './integration',
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        headless: true,
        browserName: 'chromium',
        // Test against Chrome Stable channel.
        channel: 'chrome',
      },
    },
  ],
};
