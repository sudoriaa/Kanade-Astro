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
  await expect(page.locator("html")).toHaveCSS("filter", "none");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.goto("/about/");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "切换浅色模式" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("彩色便签保存、转义、刷新和删除", async ({ page }) => {
  await page.goto("/messages/");
  await expect(page.locator(".guestbook")).toHaveAttribute("data-ready", "true");
  await page.getByLabel("怎么称呼你").fill("测试访客");
  const text = '<img src=x onerror="alert(1)"> 测试留言';
  await page.getByLabel("想说的话").fill(text);
  await page.getByRole("radio", { name: "晴空蓝" }).check();
  await page.getByRole("button", { name: "贴到留言墙" }).click();
  await expect(page.locator(".message")).toHaveAttribute("data-color", "sky");
  await expect(page.locator(".message .message-main > p")).toHaveText(text);
  await expect(page.locator(".message .message-main img")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("已保存在当前浏览器");
  await page.reload();
  await expect(page.locator(".message .message-main > p")).toHaveText(text);
  await expect(page.locator(".message")).toHaveAttribute("data-color", "sky");
  await page.getByRole("button", { name: "删除 测试访客 的留言" }).click();
  await expect(page.locator(".message")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(0);
});

test("旧留言迁移、异常颜色回退与时间排序", async ({ page }) => {
  await page.goto("/messages/");
  await page.evaluate(() => localStorage.setItem("kanade:guestbook:v1", JSON.stringify([
    { id: "older", name: "旧访客", content: "原有留言仍然保留", date: "2026-08-01T10:00:00Z" },
    { id: "newer", name: "新访客", content: "颜色字段异常也能阅读", date: "2026-09-01T10:00:00Z", color: "invalid-color" },
    { id: "older", name: "重复记录", content: "不重复展示", date: "2026-08-01T10:00:00Z" },
    { id: "broken", content: 123 }, null,
  ])));
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(2);
  await expect(page.locator(".message .note-author strong")).toHaveText(["新访客", "旧访客"]);
  for (const note of await page.locator(".message").all()) {
    await expect(note).toHaveAttribute("data-color", /^(butter|rose|mint|sky|lilac)$/);
  }
  await page.getByRole("button", { name: "切换为最早优先" }).click();
  await expect(page.locator(".message .note-author strong")).toHaveText(["旧访客", "新访客"]);
  await page.getByLabel("怎么称呼你").fill("迁移后访客");
  await page.getByLabel("想说的话").fill("新旧留言一起保存");
  await page.getByRole("button", { name: "贴到留言墙" }).click();
  await expect(page.locator(".message")).toHaveCount(3);
  await expect(page.locator(".message .note-author strong").first()).toHaveText("迁移后访客");
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(3);
  await expect(page.locator(".message .message-main > p")).toContainText(["新旧留言一起保存", "颜色字段异常也能阅读", "原有留言仍然保留"]);
});

test("五种便签、长留言及深色墙面布局", async ({ page }) => {
  await page.goto("/messages/");
  await expect(page.locator(".guestbook")).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "第一张便签，留给你" }).click();
  await expect(page.getByLabel("想说的话")).toBeFocused();
  const colors = ["奶油黄", "樱花粉", "薄荷绿", "晴空蓝", "浅芋紫"];
  for (const color of colors) {
    await page.getByRole("radio", { name: color }).check();
    await page.getByLabel("怎么称呼你").fill(color);
    await page.getByLabel("想说的话").fill(color === "浅芋紫" ? "长留言".repeat(166) + "完结" : `${color}的心情\n今天也要开心`);
    await page.getByRole("button", { name: "贴到留言墙" }).click();
    await expect(page.locator(".message .note-author strong").first()).toHaveText(color);
  }
  await expect(page.locator(".message")).toHaveCount(5);
  await expect(page.locator(".note-count")).toHaveText("5 张便签");
  expect(await page.locator(".message .message-main > p").first().evaluate(element => element.textContent?.length)).toBe(500);
  const lightColors = await page.locator(".message").evaluateAll(notes => notes.map(note => getComputedStyle(note).backgroundColor));
  expect(new Set(lightColors).size).toBe(5);
  await page.getByRole("button", { name: "切换深色模式" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const darkColors = await page.locator(".message").evaluateAll(notes => notes.map(note => getComputedStyle(note).backgroundColor));
  expect(new Set(darkColors).size).toBe(5);
  expect(darkColors).not.toEqual(lightColors);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const paragraph of await page.locator(".message .message-main > p").all()) {
    expect(await paragraph.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
  await page.reload();
  await expect(page.locator(".message")).toHaveCount(5);
  expect(new Set(await page.locator(".message").evaluateAll(notes => notes.map(note => note.getAttribute("data-color")))).size).toBe(5);
});

test("损坏存储与空白留言可恢复", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("kanade:guestbook:v1", "broken-json"));
  await page.goto("/messages/");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("怎么称呼你").fill("   ");
  await page.getByLabel("想说的话").fill("   ");
  await page.getByRole("button", { name: "贴到留言墙" }).click();
  await expect(page.getByRole("alert")).toContainText("请填写昵称和想说的话");
  await page.getByLabel("怎么称呼你").fill("访客");
  await page.getByLabel("想说的话").fill("现在恢复正常");
  await page.getByRole("button", { name: "贴到留言墙" }).click();
  await expect(page.locator(".message .message-main > p")).toHaveText("现在恢复正常");
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
  await page.getByRole("button", { name: "贴到留言墙" }).click();
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
