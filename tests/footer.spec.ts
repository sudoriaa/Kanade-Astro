import { test, expect } from "@playwright/test";
import { t } from "../src/i18n";

test("Footer credits the Kanade theme repository", async ({ page }) => {
  await page.goto("/");

  const themeCredit = page.locator(
    '.site-footer a[href="https://github.com/sudoriaa/Kanade-Astro"]',
  );
  await expect(themeCredit).toHaveText("Kanade");
  await expect(themeCredit).toHaveAttribute("target", "_blank");
  await expect(page.locator(".site-footer")).toContainText(
    `${t("footer.theme")}: Kanade`,
  );
});
