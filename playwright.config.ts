import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "tests/screenshots/playwright-report.json" }]],
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
    screenshot: "off",
    video: "off",
    trace: "off",
  },
  projects: [
    {
      name: "audit",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
