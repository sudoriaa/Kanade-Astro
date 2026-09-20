import { test, expect } from "@playwright/test";

test("首页分类、分页与 URL 刷新恢复", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".post-card")).toHaveCount(5);
  await page.getByRole("button", { name: "下一页", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator(".post-card")).toHaveCount(3);
  await page.reload();
  await expect(page.locator(".post-card")).toHaveCount(3);
  await page.getByRole("button", { name: "前端开发", exact: true }).click();
  await expect(page.locator(".post-card")).toHaveCount(4);
  await expect(page.locator('.post-card:not([data-category="前端开发"])')).toHaveCount(0);
  await expect(page).toHaveURL(/category=/);
});

test("标签、月份与不存在的分类", async ({ page }) => {
  await page.goto("/posts/?tag=Vue");
  await expect(page.locator(".post-card")).toHaveCount(2);
  await page.goto("/posts/?month=2026-08");
  await expect(page.locator(".post-card")).toHaveCount(2);
  await expect(page.locator(".filter-summary")).toContainText("2026-08");
  await page.goto("/posts/?category=missing&page=-5");
  await expect(page.getByText("这一页，还等着新的故事")).toBeVisible();
  await page.getByRole("button", { name: "查看全部文章" }).click();
  await expect(page.locator(".post-card")).toHaveCount(5);
});

test("全站搜索、空结果和焦点恢复", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute("data-ready", "true");
  const opener = page.getByRole("button", { name: "搜索文章", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.getByRole("searchbox", { name: "搜索关键词" }).fill("CSS");
  await expect(dialog.locator(".search-result")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "搜索关键词" }).fill("no-such-post-9876");
  await expect(dialog.getByText("还没有找到这段文字")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await page.getByRole("searchbox", { name: "搜索关键词" }).fill("CSS");
  await dialog.locator(".search-result").click();
  await expect(page).toHaveURL(/css-small-details/);
  await expect(page.locator("#article-body")).toBeVisible();
});

test("深浅主题在刷新和跨页后保留", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".post-feed")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "切换深色模式" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.goto("/about/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "切换浅色模式" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("本地留言保存、转义、刷新和删除", async ({ page }) => {
  await page.goto("/messages/");
  await expect(page.locator(".guestbook")).toHaveAttribute("data-ready", "true");
  await page.getByLabel("怎么称呼你").fill("测试访客");
  const text = '<img src=x onerror="alert(1)"> 测试留言';
  await page.getByLabel("想说的话").fill(text);
  await page.getByRole("button", { name: "保存留言" }).click();
  await expect(page.locator(".message-main > p")).toHaveText(text);
  await expect(page.locator(".message-main img")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("已保存在当前浏览器");
  await page.reload();
  await expect(page.locator(".message-main > p")).toHaveText(text);
  await page.getByRole("button", { name: "删除 测试访客 的留言" }).click();
  await expect(page.locator(".message")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(0);
});

test("损坏存储与空白留言可恢复", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kanade:guestbook:v1", "broken-json"));
  await page.goto("/messages/");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("怎么称呼你").fill("   ");
  await page.getByLabel("想说的话").fill("   ");
  await page.getByRole("button", { name: "保存留言" }).click();
  await expect(page.getByRole("alert")).toContainText("请填写昵称和想说的话");
  await page.getByLabel("怎么称呼你").fill("访客");
  await page.getByLabel("想说的话").fill("现在恢复正常");
  await page.getByRole("button", { name: "保存留言" }).click();
  await expect(page.locator(".message-main > p")).toHaveText("现在恢复正常");
});

test("禁止存储时主题可切换、留言报告未保存", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", { value: () => { throw new Error("Storage blocked"); } });
    Object.defineProperty(Storage.prototype, "setItem", { value: () => { throw new Error("Storage blocked"); } });
  });
  await page.goto("/messages/");
  await expect(page.locator(".guestbook")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "切换深色模式" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByLabel("怎么称呼你").fill("访客");
  await page.getByLabel("想说的话").fill("这条应报告保存失败");
  await page.getByRole("button", { name: "保存留言" }).click();
  await expect(page.getByRole("alert")).toContainText("留言未保存");
  await expect(page.locator(".message")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("文章目录、代码块与相邻文章", async ({ page, isMobile }) => {
  await page.goto("/posts/hello-kanade/");
  await expect(page.locator(".article-header h1")).toContainText("你好，Kanade");
  await expect(page.locator("#article-body h2")).toHaveCount(4);
  await expect(page.locator(".copy-code")).toHaveCount(1);
  if (isMobile) {
    await page.locator(".mobile-toc summary").click();
    await page.locator(".mobile-toc a").last().click();
  } else {
    await page.locator(".toc a").last().click();
  }
  await expect(page).toHaveURL(/#/);
  await expect(page.locator("#reading-progress")).not.toHaveAttribute("style", "width: 0%;");
  await page.locator(".adjacent-posts a").click();
  await expect(page).toHaveURL(/astro-islands/);
});

test("页面布局、资源和浏览器错误", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  for (const path of ["/", "/posts/", "/friends/", "/about/", "/messages/", "/posts/hello-kanade/"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    const size = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
    expect(size.content, path).toBeLessThanOrEqual(size.width);
    await expect(page.locator('img')).not.toHaveCount(0);
    const broken = await page.locator("img").evaluateAll(images => images.filter(image => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0).map(image => image.getAttribute("src")));
    expect(broken).toEqual([]);
  }
  if (isMobile) {
    await page.getByRole("button", { name: "打开菜单" }).click();
    await expect(page.getByRole("navigation", { name: "主导航" })).toBeVisible();
    await page.getByRole("navigation", { name: "主导航" }).getByRole("link", { name: "友链" }).click();
    await expect(page).toHaveURL(/friends/);
  }
  expect(errors).toEqual([]);
});

test("站点地图、RSS、404 与旧路径", async ({ page, request }) => {
  const feed = await request.get("/rss.xml");
  expect(feed.status()).toBe(200);
  expect((await feed.text()).match(/<item>/g)).toHaveLength(8);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  const response = await page.goto("/a-page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("这页故事，暂时还没写到")).toBeVisible();
  await page.goto("/articles/");
  await expect(page).toHaveURL(/\/posts\//);
  await page.goto("/comments/");
  await expect(page).toHaveURL(/\/messages\//);
});