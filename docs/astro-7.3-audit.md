# Astro 7.3 项目检查与迁移

检查日期：2026-10-08。

## 官方依据

已读取用户提供的 [Getting started](https://docs.astro.build/en/getting-started/)，并核对 [Astro 官方 npm 包](https://www.npmjs.com/package/astro) 的稳定发布版本为 7.3.7。原项目版本为 5.16.9，因此同时检查跨越 6 和 7 的迁移要求。

- [Astro 6 迁移指南](https://docs.astro.build/en/guides/upgrade-to/v6/)：内容集合、Zod 4、Node 环境及废弃 API。
- [Astro 7 迁移指南](https://docs.astro.build/en/guides/upgrade-to/v7/)：Vite 8、Rust 编译器、Sätteri Markdown 和空白处理。
- [内容集合](https://docs.astro.build/en/guides/content-collections/)：Content Layer、glob loader、schema、render() 和静态路由。
- [TypeScript](https://docs.astro.build/en/guides/typescript/)：strict 配置、Astro 类型同步和检查流程。
- [环境变量](https://docs.astro.build/en/guides/environment-variables/)：在 Astro 配置中使用 Vite loadEnv()，并直接声明 Vite 依赖。
- [Vue 集成](https://docs.astro.build/en/guides/integrations-guide/vue/)：使用与 Astro 7 匹配的集成版本。
- [官方 RSS](https://docs.astro.build/en/recipes/rss/) 和 [官方 Sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)：从内容集合和页面路由生成订阅与站点地图。
- [Iconify Tailwind 4](https://iconify.design/docs/usage/css/tailwind/tailwind4/)：仅安装使用的图标集。

## 依赖与环境

| 项目                     | 原版本  | 本次版本 |
| ------------------------ | ------- | -------- |
| Astro                    | 5.16.9  | 7.3.7    |
| @astrojs/vue             | 5.1.4   | 7.0.3    |
| Vue                      | 3.5.26  | 3.5.43   |
| Tailwind CSS / Vite 插件 | 4.1.18  | 4.3.3    |
| Tailwind Typography      | 0.5.19  | 0.5.20   |
| TypeScript               | 5.9.3   | 6.0.3    |
| vue-tsc                  | 3.3.11  | 3.3.12   |
| Playwright               | 1.63.0  | 1.64.0   |
| @types/node              | 22.20.4 | 24.19.1  |

新增官方 RSS 4.0.19、Sitemap 3.7.4、直接依赖 Vite 8.3.3，以及 Prettier 与 Astro 格式插件。刷新整个依赖树并更新 pnpm 锁文件。

TypeScript 的 npm 稳定版为 7.0.2，但 `@astrojs/check@0.9.10` 的 peer dependency 明确为 `^5.0.0 || ^6.0.0`。采用其支持的最新 TypeScript 6.0.3，避免不满足检查器兼容约束。Node 类型采用 24 系列，与推荐运行环境匹配。pnpm 固定为现有 10.33.0，保障开发、CI 和 Docker 的安装方式一致。

推荐 Node.js 24 LTS，Astro 最低要求 22.12。新增 `.node-version`、`engines` 和 `packageManager`；Docker 构建与 Netlify 同步使用 Node 24。

## 修复与规范

| 范围               | 处理结果                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Astro 配置         | 显式声明 static 输出、site 和 trailingSlash；统一读取 SITE_URL 并校验 HTTP(S) 根地址                                        |
| 内容集合           | 保留已经正确使用的 Content Layer / glob / render()；Zod 改从 astro/zod 导入；跳过下划线开头的文件；校验非空标题、摘要与标签 |
| 分类与封面         | 用 src/data/post-options.ts 统一定义，供 schema、侧栏、列表共享                                                             |
| Markdown           | 采用 Astro 7 默认 Sätteri；项目没有 remark/rehype 插件，无需安装旧处理器；验证文章标题、目录与代码复制                      |
| 空白处理           | 显式 compressHTML: true，保留原项目行内元素的空白行为                                                                       |
| SEO                | canonical、OG、RSS 和 Sitemap 使用同一站点地址；补齐站点名、语言、作者、Twitter 卡片和文章发布时间                          |
| 标题结构           | 文章页仅保留文章标题为 h1，装饰性欢迎标题使用 h2                                                                            |
| 错误页             | 404 添加 noindex；站点地图排除错误页与旧路径跳转                                                                            |
| RSS / Sitemap      | 使用官方工具生成；robots.txt 和 head 指向官方 sitemap-index.xml；保留旧 sitemap.xml 兼容入口                                |
| 品牌与作者         | 页脚、导航无障碍标签、RSS 标题与文章作者引用现有配置                                                                        |
| 深色主题           | 修复封面选择器，仅对封面应用滤镜；浏览器断言整页无滤镜                                                                      |
| 组件清理           | CustomScrollbar 卸载时断开 MutationObserver、清除定时器并恢复拖动状态；修正拖动距离计算                                     |
| 无 JavaScript 阅读 | 首页与归档提供所有文章的静态链接，文章正文保持静态输出                                                                      |
| Windows 预览       | 更新 Astro CLI 入口到 node_modules/astro/bin/astro.mjs                                                                      |
| 格式与行尾         | Prettier / Astro 插件、EditorConfig、Git LF 约束，统一格式                                                                  |
| 安装               | 图标依赖替换为当前使用的 8 个独立图标集；冻结锁文件可安装；仅允许 esbuild 安装脚本                                          |
| 构建与测试         | 构建先同步类型并运行 Astro / Vue 检查；测试先构建；浏览器测试不复用可能过期的预览服务                                       |
| CI                 | 加入安装、格式、安全审计、类型检查、构建和桌面 / 手机浏览器测试                                                             |

## 安全审计

初始 `pnpm audit` 报告 71 项已知漏洞（1 critical、36 high、25 moderate、9 low）。升级直接依赖、刷新间接依赖并修复 Typography 的解析器依赖后，审计报告为 0 项已知漏洞。

`@tailwindcss/typography@0.5.20` 仍声明旧版 `postcss-selector-parser`。依据 [维护者变更记录](https://github.com/postcss/postcss-selector-parser/blob/master/CHANGELOG.md)，7.1.6 修复平面选择器解析的 CPU 消耗问题。针对 Typography 这一依赖路径设置覆盖，已验证生成样式与浏览器行为。上游发布修复依赖后应移除这一临时覆盖。

## 验证范围

- Astro 与 Vue 类型检查：0 errors、0 warnings、0 hints。
- Astro 7.3.7 静态构建成功，生成 16 个 HTML 页面、RSS、robots.txt 和官方 Sitemap。
- 浏览器测试覆盖桌面与手机共 30 项：筛选、分页、搜索、主题、留言存储、输入转义、目录、代码块、图片加载、布局、旧路由、404、元数据、XML、站点地图路由和关闭 JavaScript 时的阅读。
- 使用 SITE_URL=https://example.com 构建并验证所有元数据、订阅和站点地图统一使用配置域名，canonical 不携带跟踪查询或片段。
- 依赖安全审计和源码格式检查。
- 冻结锁文件安装及 Windows 后台预览入口。

本次检查针对本地源码与实际构建、浏览器表现。当前环境没有 Docker CLI，未运行容器镜像构建；新增 GitHub Actions 也需要推送后才能在远程执行。手机测试采用 Chromium 的设备模拟，未在真实 iPhone / Safari 上执行。不将这些尚未执行的环境检查描述为已通过。

正式部署仍须设置实际 SITE_URL 并重新构建。默认 localhost 地址仅用于本地开发。当前留言仍为浏览器本地存储；站点内容配置仍采用 src/config.ts，尚未迁移为单个 JSON 文件。

这份报告反映检查日期时的兼容性与验证结果，后续依赖、环境或业务内容变化应重新运行检查。
