import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "vite";

// Match Astro's production .env loading when a developer overrides the language.
const environment = loadEnv(
  "production",
  process.cwd(),
  "PUBLIC_SITE_LANGUAGE",
);
if (!process.env.PUBLIC_SITE_LANGUAGE && environment.PUBLIC_SITE_LANGUAGE) {
  process.env.PUBLIC_SITE_LANGUAGE = environment.PUBLIC_SITE_LANGUAGE;
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  workers: 3,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : {},
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "pnpm exec astro preview --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
