# Astro 官方主题目录提交材料

当前状态：公网演示已部署，模板源码与预览图已推送；官方目录申请尚未提交。

## 提交入口

https://portal.astro.build/themes/submit

提交成功后需要等待 Astro 官方审核。表单说明：通常每周五处理申请。

## 表单内容

Theme name:

Kanade

Free or paid:

Free

Public repo URL:

https://github.com/sudoriaa/Kanade-Astro/tree/codex/astro-theme

Live demo URL:

https://sudoriaa.github.io/Kanade-Astro/

Short description:

A pastel Astro 7 blog theme with Markdown posts, Vue-powered search, light and dark modes, and a colorful sticky-note guestbook.

Full description（粘贴为普通文字，不使用 Markdown 或 HTML 标记）:

Kanade is a gentle, pastel-colored blog theme built with Astro 7, Vue 3, and Tailwind CSS. An illustrated welcome section, flowing waves, rounded cards, and a three-column desktop layout give your writing a warm place to live. The layout adapts to smaller screens and includes light and dark themes.

Publish Markdown posts with categories, tags, archives, and pagination. Readers can search titles, summaries, categories, and tags, follow an article's table of contents, copy code snippets, and subscribe through RSS. The theme also includes an about page, links page, sitemap, and custom 404 page.

The guestbook turns messages into colorful sticky notes with five paper colors, tape details, and a subtle posting animation. Notes are stored locally in the current browser; shared public comments require a separate service or backend.

Kanade ships with generic sample content and a Chinese README covering setup, writing, customization, testing, and deployment. The live demo is built directly from the linked template branch and supports deployment under a subpath such as GitHub Pages.

Tools used:

Vue, Tailwind CSS（选择表单提供的对应选项；若提供 TypeScript，也可勾选）

Categories:

Blog（选择表单中的对应选项）

## 预览图片

均为 1280 × 720 PNG（16:9），三张总计约 1.95 MiB，低于表单要求的 5 MB。

1. docs/images/astro-theme-light.png
2. docs/images/astro-theme-dark.png
3. docs/images/astro-theme-wall.png

截图来自此模板分支的真实构建，默认界面为中文，符合官方允许演示使用非英文内容的要求。

## 已完成验证

- Astro 7.3.3、@astrojs/vue 7.0.3。
- Astro 与 Vue 类型检查通过。
- 24 项桌面 / 手机浏览器测试通过。
- 六个主要页面的子路径链接、资源与浏览器错误检查通过。
- GitHub Actions 构建与 Pages 部署成功。
- 公网首页返回 HTTP 200，generator 为 Astro v7.3.3。
- 通用作者资料与社交根域链接，无个人社交账号作为演示默认值。
- main 保留原有个人博客；公开目录应链接 codex/astro-theme 分支。

## 参考

官方提交页面：https://portal.astro.build/themes/submit
官方提交页引用的审核说明：https://hackmd.io/@sarah11918/BJMjDSMDZl
成功部署：https://github.com/sudoriaa/Kanade-Astro/actions/runs/35495912747