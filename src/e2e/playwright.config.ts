import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
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
export default config;
