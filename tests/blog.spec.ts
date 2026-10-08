import { test, expect } from "@playwright/test";
import { t, language, ogLocale } from "../src/i18n";
import settings from "../src/site.config.json" with { type: "json" };

test("Home categories, pagination, and URL state after reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".post-card")).toHaveCount(5);
  await page
    .getByRole("button", { name: t("post.nextPage"), exact: true })
    .click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator(".post-card")).toHaveCount(3);
  await page.reload();
  await expect(page.locator(".post-card")).toHaveCount(3);
  await page
    .getByRole("button", { name: t("category.frontend"), exact: true })
    .click();
  await expect(page.locator(".post-card")).toHaveCount(4);
  await expect(
    page.locator('.post-card:not([data-category="frontend"])'),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/category=/);
});

test("Tags, month archives, and an unknown category", async ({ page }) => {
  await page.goto("/posts/?tag=Vue");
  await expect(page.locator(".post-card")).toHaveCount(2);
  await page.goto("/posts/?month=2026-08");
  await expect(page.locator(".post-card")).toHaveCount(2);
  await expect(page.locator(".filter-summary")).toContainText("2026-08");
  await page.goto("/posts/?category=missing&page=-5");
  await expect(page.getByText(t("post.emptyTitle"))).toBeVisible();
  await page.getByRole("button", { name: t("post.viewAll") }).click();
  await expect(page.locator(".post-card")).toHaveCount(5);
});

test("Search, empty results, and focus restoration", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const opener = page.getByRole("button", {
    name: t("nav.search"),
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.getByRole("searchbox", { name: t("search.keywords") }).fill("CSS");
  await expect(dialog.locator(".search-result")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: t("search.keywords") })
    .fill("no-such-post-9876");
  await expect(dialog.getByText(t("search.emptyTitle"))).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await page.getByRole("searchbox", { name: t("search.keywords") }).fill("CSS");
  await dialog.locator(".search-result").click();
  await expect(page).toHaveURL(/css-small-details/);
  await expect(page.locator("#article-body")).toBeVisible();
});

test("Theme persistence across reloads and pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("html")).toHaveCSS("filter", "none");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.goto("/about/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: t("nav.light") }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("Colored notes: save, escape, reload, and delete", async ({ page }) => {
  await page.goto("/messages/");
  await expect(page.locator(".guestbook")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByLabel(t("guestbook.name")).fill("测试访客");
  const text = '<img src=x onerror="alert(1)"> 测试留言';
  await page.getByRole("textbox", { name: t("guestbook.content") }).fill(text);
  await page.getByRole("radio", { name: t("paper.sky.label") }).check();
  await page.getByRole("button", { name: t("guestbook.submit") }).click();
  await expect(page.locator(".message")).toHaveAttribute("data-color", "sky");
  await expect(page.locator(".message .message-main > p")).toHaveText(text);
  await expect(page.locator(".message .message-main img")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText(t("guestbook.saved"));
  await page.reload();
  await expect(page.locator(".message .message-main > p")).toHaveText(text);
  await expect(page.locator(".message")).toHaveAttribute("data-color", "sky");
  await page
    .getByRole("button", { name: t("guestbook.delete", { name: "测试访客" }) })
    .click();
  await expect(page.locator(".message")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(0);
});

test("Legacy note migration, invalid colors, and chronological order", async ({
  page,
}) => {
  await page.goto("/messages/");
  await page.evaluate(() =>
    localStorage.setItem(
      "kanade:guestbook:v1",
      JSON.stringify([
        {
          id: "older",
          name: "旧访客",
          content: "原有留言仍然保留",
          date: "2026-08-01T10:00:00Z",
        },
        {
          id: "newer",
          name: "新访客",
          content: "颜色字段异常也能阅读",
          date: "2026-09-01T10:00:00Z",
          color: "invalid-color",
        },
        {
          id: "older",
          name: "重复记录",
          content: "不重复展示",
          date: "2026-08-01T10:00:00Z",
        },
        { id: "broken", content: 123 },
        null,
      ]),
    ),
  );
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(2);
  await expect(page.locator(".message .note-author strong")).toHaveText([
    "新访客",
    "旧访客",
  ]);
  for (const note of await page.locator(".message").all()) {
    await expect(note).toHaveAttribute(
      "data-color",
      /^(butter|rose|mint|sky|lilac)$/,
    );
  }
  await page.getByRole("button", { name: t("guestbook.sortOld") }).click();
  await expect(page.locator(".message .note-author strong")).toHaveText([
    "旧访客",
    "新访客",
  ]);
  await page.getByLabel(t("guestbook.name")).fill("迁移后访客");
  await page
    .getByRole("textbox", { name: t("guestbook.content") })
    .fill("新旧留言一起保存");
  await page.getByRole("button", { name: t("guestbook.submit") }).click();
  await expect(page.locator(".message")).toHaveCount(3);
  await expect(page.locator(".message .note-author strong").first()).toHaveText(
    "迁移后访客",
  );
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(3);
  await expect(page.locator(".message .message-main > p")).toContainText([
    "新旧留言一起保存",
    "颜色字段异常也能阅读",
    "原有留言仍然保留",
  ]);
});

test("Five note colors, long messages, and dark theme layout", async ({
  page,
}) => {
  await page.goto("/messages/");
  await expect(page.locator(".guestbook")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByRole("button", { name: t("guestbook.first") }).click();
  await expect(
    page.getByRole("textbox", { name: t("guestbook.content") }),
  ).toBeFocused();
  const colors = ["butter", "rose", "mint", "sky", "lilac"].map((color) =>
    t(`paper.${color}.label` as Parameters<typeof t>[0]),
  );
  for (const color of colors) {
    await page.getByRole("radio", { name: color }).check();
    await page.getByLabel(t("guestbook.name")).fill(color);
    await page
      .getByRole("textbox", { name: t("guestbook.content") })
      .fill(
        color === t("paper.lilac.label")
          ? "长留言".repeat(166) + "完结"
          : `${color}的心情\n今天也要开心`,
      );
    await page.getByRole("button", { name: t("guestbook.submit") }).click();
    await expect(
      page.locator(".message .note-author strong").first(),
    ).toHaveText(color);
  }
  await expect(page.locator(".message")).toHaveCount(5);
  await expect(page.locator(".note-count")).toHaveText(
    t("guestbook.count", { count: 5 }),
  );
  expect(
    await page
      .locator(".message .message-main > p")
      .first()
      .evaluate((element) => element.textContent?.length),
  ).toBe(500);
  const lightColors = await page
    .locator(".message")
    .evaluateAll((notes) =>
      notes.map((note) => getComputedStyle(note).backgroundColor),
    );
  expect(new Set(lightColors).size).toBe(5);
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const darkColors = await page
    .locator(".message")
    .evaluateAll((notes) =>
      notes.map((note) => getComputedStyle(note).backgroundColor),
    );
  expect(new Set(darkColors).size).toBe(5);
  expect(darkColors).not.toEqual(lightColors);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  for (const paragraph of await page
    .locator(".message .message-main > p")
    .all()) {
    expect(
      await paragraph.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(5);
  expect(
    new Set(
      await page
        .locator(".message")
        .evaluateAll((notes) =>
          notes.map((note) => note.getAttribute("data-color")),
        ),
    ).size,
  ).toBe(5);
});

test("Recovery from corrupt storage and blank messages", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("kanade:guestbook:v1", "broken-json"),
  );
  await page.goto("/messages/");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel(t("guestbook.name")).fill("   ");
  await page.getByRole("textbox", { name: t("guestbook.content") }).fill("   ");
  await page.getByRole("button", { name: t("guestbook.submit") }).click();
  await expect(page.getByRole("alert")).toContainText(t("guestbook.required"));
  await page.getByLabel(t("guestbook.name")).fill("访客");
  await page
    .getByRole("textbox", { name: t("guestbook.content") })
    .fill("现在恢复正常");
  await page.getByRole("button", { name: t("guestbook.submit") }).click();
  await expect(page.locator(".message .message-main > p")).toHaveText(
    "现在恢复正常",
  );
});

test("Blocked storage: themes work and notes report saving failure", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value: () => {
        throw new Error("Storage blocked");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.goto("/messages/");
  await expect(page.locator(".guestbook")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByLabel(t("guestbook.name")).fill("访客");
  await page
    .getByRole("textbox", { name: t("guestbook.content") })
    .fill("这条应报告保存失败");
  await page.getByRole("button", { name: t("guestbook.submit") }).click();
  await expect(page.getByRole("alert")).toContainText(
    t("guestbook.saveFailed"),
  );
  await expect(page.locator(".message")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Article contents, code blocks, and adjacent posts", async ({
  page,
  isMobile,
}) => {
  await page.goto("/posts/hello-kanade/");
  await expect(page.locator(".article-header h1")).toContainText(
    { "zh-CN": "你好，Kanade", en: "Hello, Kanade", ja: "こんにちは、Kanade" }[
      language
    ],
  );
  await expect(page.locator("#article-body h2")).toHaveCount(4);
  await expect(page.locator(".copy-code")).toHaveCount(1);
  if (isMobile) {
    await page.locator(".mobile-toc summary").click();
    await page.locator(".mobile-toc a").last().click();
  } else {
    await page.locator(".toc a").last().click();
  }
  await expect(page).toHaveURL(/#/);
  await expect(page.locator("#reading-progress")).not.toHaveAttribute(
    "style",
    "width: 0%;",
  );
  await page.locator(".adjacent-posts a").click();
  await expect(page).toHaveURL(/astro-islands/);
});

test("Page layouts, assets, and browser errors", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const path of [
    "/",
    "/posts/",
    "/friends/",
    "/about/",
    "/messages/",
    "/posts/hello-kanade/",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const size = await page.evaluate(() => ({
      width: innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(size.content, path).toBeLessThanOrEqual(size.width);
    await expect(page.locator("img")).not.toHaveCount(0);
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter(
            (image) =>
              !(image as HTMLImageElement).complete ||
              (image as HTMLImageElement).naturalWidth === 0,
          )
          .map((image) => image.getAttribute("src")),
      );
    expect(broken).toEqual([]);
  }
  if (isMobile) {
    await page.getByRole("button", { name: t("nav.openMenu") }).click();
    await expect(
      page.getByRole("navigation", { name: t("nav.main") }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: t("nav.main") })
      .getByRole("link", { name: t("nav.friends") })
      .click();
    await expect(page).toHaveURL(/friends/);
  }
  expect(errors).toEqual([]);
});

test("Sitemap, RSS, 404, and legacy redirects", async ({ page, request }) => {
  const feed = await request.get("/rss.xml");
  expect(feed.status()).toBe(200);
  expect((await feed.text()).match(/<item>/g)).toHaveLength(8);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  const response = await page.goto("/a-page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByText(t("error.heading"))).toBeVisible();
  await page.goto("/articles/");
  await expect(page).toHaveURL(/\/posts\//);
  await page.goto("/comments/");
  await expect(page).toHaveURL(/\/messages\//);
});

test("SEO metadata, official sitemap, and RSS consistency", async ({
  page,
  request,
}) => {
  await page.goto("/posts/hello-kanade/?tracking=example#article-body");
  await expect(page.locator("h1")).toHaveCount(1);
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(canonical).toMatch(/\/posts\/hello-kanade\/$/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonical!,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  await expect(
    page.locator('meta[property="article:published_time"]'),
  ).toHaveAttribute("content", "2026-09-18T00:00:00.000Z");
  const sitemap = await request.get("/sitemap-0.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  const locations = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, "application/xml");
    if (doc.querySelector("parsererror"))
      throw new Error("Invalid sitemap XML");
    return [...doc.querySelectorAll("url > loc")].map(
      (entry) => entry.textContent!,
    );
  }, xml);
  expect(locations).toHaveLength(13);
  expect(locations).toContain(canonical);
  expect(
    locations.some((url) =>
      /\/(?:404|articles|comments)(?:\/|\.|$)/.test(new URL(url).pathname),
    ),
  ).toBe(false);
  for (const url of locations) {
    expect(new URL(url).origin).toBe(new URL(canonical!).origin);
    expect((await request.get(new URL(url).pathname)).status()).toBe(200);
  }
  expect((await request.get("/sitemap-index.xml")).status()).toBe(200);
  const feed = await request.get("/rss.xml");
  const feedInfo = await page.evaluate(
    (source) => {
      const doc = new DOMParser().parseFromString(source, "application/xml");
      return {
        errors: doc.querySelectorAll("parsererror").length,
        links: [...doc.querySelectorAll("item > link")].map(
          (link) => link.textContent!,
        ),
      };
    },
    await feed.text(),
  );
  expect(feedInfo.errors).toBe(0);
  expect(feedInfo.links).toHaveLength(8);
  expect(feedInfo.links).toContain(canonical);
  await page.goto("/a-page-that-does-not-exist/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
});

test("Covers follow the dark theme", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const cover = page.locator(".post-cover").first();
  await expect(cover).toHaveCSS("filter", "none");
  await page.getByRole("button", { name: t("nav.dark") }).click();
  await expect(cover).toHaveCSS("filter", "brightness(0.75) saturate(0.8)");
});

test("Reading all posts without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const fallback = page.getByRole("region", {
      name: t("post.all"),
      exact: true,
    });
    await expect(fallback.getByRole("link")).toHaveCount(8);
    await fallback.getByRole("link").last().click();
    await expect(page.locator("#article-body")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("Configured language, localized search, metadata, and local fonts", async ({
  page,
  request,
}) => {
  const fonts: string[] = [];
  const hydrationWarnings: string[] = [];
  page.on("response", (response) => {
    if (/\.woff2(?:\?|$)/.test(response.url()) && response.ok())
      fonts.push(response.url());
  });
  page.on("console", (message) => {
    if (/hydration.*mismatch/i.test(message.text()))
      hydrationWarnings.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", language);
  await expect(page).toHaveTitle(
    `${settings.site.name} · ${t("site.titleSuffix")}`,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    ogLocale,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    t("site.description"),
  );
  await expect(page.locator(".hero-title")).toContainText(t("hero.title"));
  if (language === "en")
    expect(await page.locator("body").innerText()).not.toMatch(
      /\p{Script=Han}/u,
    );
  if (language === "ja")
    expect(await page.locator("body").innerText()).toMatch(
      /[\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );

  await page
    .getByRole("button", { name: t("nav.search"), exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: t("search.keywords") })
    .fill(t("category.frontend"));
  await expect(page.getByRole("dialog").locator(".search-result")).toHaveCount(
    4,
  );
  await page.keyboard.press("Escape");

  await page.evaluate(() => document.fonts.ready);
  const family =
    language === "ja"
      ? "Noto Sans JP Variable"
      : language === "en"
        ? "Noto Sans Variable"
        : "ZaoZiGongFangYueYuan";
  const loaded = await page.evaluate(() =>
    [...document.fonts]
      .filter((face) => face.status === "loaded")
      .map((face) => face.family.replaceAll('"', "")),
  );
  expect(loaded).toContain(family);
  expect(loaded).toContain("Oxanium-Medium");
  expect(fonts.length).toBeGreaterThan(0);
  expect(
    fonts.every((url) => new URL(url).origin === new URL(page.url()).origin),
  ).toBe(true);
  await page.goto("/posts/hello-kanade/");
  await expect(page.locator("#article-body h2").first()).toHaveCSS(
    "font-family",
    new RegExp(family),
  );

  const rss = await (await request.get("/rss.xml")).text();
  const feedInfo = await page.evaluate((source) => {
    const xml = new DOMParser().parseFromString(source, "application/xml");
    return {
      language: xml.querySelector("channel > language")?.textContent,
      title: xml.querySelector("item > title")?.textContent,
    };
  }, rss);
  expect(feedInfo.language).toBe(language);
  expect(feedInfo.title).toBe(
    await page.locator(".article-header h1").textContent(),
  );
  expect(hydrationWarnings).toEqual([]);
});
