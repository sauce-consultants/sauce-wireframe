import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:3002",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
  webServer: {
    command: "TURSO_DATABASE_URL=file:./data/test.db TURSO_AUTH_TOKEN= npx next start --port 3002",
    url: "http://127.0.0.1:3002",
    reuseExistingServer: true,
    timeout: 30000,
  },
  globalSetup: "./tests/setup/global-setup.ts",
});
