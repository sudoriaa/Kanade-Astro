# Kanade · 奏

**README language: English.** This English README and the English version of the project were generated with AI. If you find inaccurate translations, mistakes, or bugs, please help improve them through a [pull request](https://github.com/sudoriaa/Kanade-Astro/pulls) or an [issue](https://github.com/sudoriaa/Kanade-Astro/issues).

[简体中文](README.md) · **English** · [日本語](README.ja.md)

A personal blog for code, ideas, and everyday life. Built with Astro 7.3, Vue 3, Tailwind CSS 4, and TypeScript 6, with an illustrated hero, rounded cards, and gentle waves.

![Kanade desktop homepage; preview uses Chinese](docs/images/home.png)

![Colorful guestbook; notes shown are examples](docs/images/message-wall.png)

## Features

- Markdown posts, categories, tags, monthly archives, pagination, and URL based filters.
- Search across titles, descriptions, localized categories, and tags; `Ctrl / ⌘ + K` opens it and `Esc` closes it.
- Syntax highlighting, code copying, a table of contents, reading progress, link sharing, and adjacent posts.
- Light and dark themes with saved preferences, responsive navigation, keyboard focus, and reduced motion support.
- About, links, guestbook, and 404 pages; redirects from `/articles/` and `/comments/`.
- RSS, sitemap, robots.txt, canonical URLs, and Open Graph metadata.
- Chinese, English, or Japanese selected by the developer before building. Each language includes eight example posts.

The site produces static HTML in `dist/`. Interactive Vue components hydrate where needed. No database is required.

## Quick start

Use Node.js 24 LTS (minimum 22.12) and pnpm 10.33.0. The repository declares these through `.node-version`, `engines`, and `packageManager`.

```sh
git clone https://github.com/sudoriaa/Kanade-Astro.git
cd Kanade-Astro
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

| Command                             | Purpose                                        |
| ----------------------------------- | ---------------------------------------------- |
| `pnpm dev`                          | Start the development server                   |
| `pnpm check`                        | Check Astro, Vue, and TypeScript               |
| `pnpm build`                        | Check types and generate `dist/`               |
| `pnpm preview`                      | Preview an existing build                      |
| `pnpm test`                         | Build and run desktop and mobile browser tests |
| `pnpm test:e2e`                     | Test an existing build                         |
| `pnpm format` / `pnpm format:check` | Format / check source formatting               |
| `pnpm deploy:local`                 | Start a background preview on Windows          |

## Choose the site language

Edit [src/site.config.json](src/site.config.json), changing the existing `language` property:

```json
"language": "en"
```

Supported values are `zh-CN`, `en`, and `ja`. The default is `zh-CN`. Restart the development server after changing the language; for deployment, rebuild and publish `dist/`.

This setting selects navigation, page text, accessible labels, dates, counts, categories, metadata, RSS, fonts, and posts. Each build publishes one language at the same routes, such as `/posts/hello-kanade/`. There is no visitor facing language menu or language prefix in URLs.

`PUBLIC_SITE_LANGUAGE` can override the JSON setting in a hosting platform or `.env`. For a temporary PowerShell build:

```powershell
$env:PUBLIC_SITE_LANGUAGE = "en"
pnpm build
pnpm test:e2e
Remove-Item Env:PUBLIC_SITE_LANGUAGE
```

On POSIX shells, use `PUBLIC_SITE_LANGUAGE=en pnpm build`. Use the same language when building and testing. Unset the override to return to the JSON setting.

## Customize content

[src/site.config.json](src/site.config.json) contains site identity, logo text, favicon, per language keywords, author names, avatar, hero image, navigation, and social links. `navigation[].label` and `socialLinks[].label` refer to translation keys; social links can instead use a literal `name` with an empty `label`. `$author.github` in a social link resolves to the configured author URL.

The `text` object overrides any built in translation for a language. For example, replace the existing `text.en` object with:

```json
{
  "site.titleSuffix": "My development journal",
  "site.description": "Notes about the web, tools, and everyday life.",
  "hero.title": "Welcome to my corner",
  "author.bio": "A developer who enjoys small projects.",
  "nav.friends": "Bookmarks"
}
```

Keep the other language entries in `text`. Keys and default copy are listed in [src/i18n/en.json](src/i18n/en.json), [zh-CN.json](src/i18n/zh-CN.json), and [ja.json](src/i18n/ja.json). Placeholders such as `{site}`, `{name}`, and `{count}` should be preserved. English count messages have `.one` variants for singular values; override those too when changing a count message. The translation module uses `Intl` for dates and plural forms.

| Location                   | Contents                                                       |
| -------------------------- | -------------------------------------------------------------- |
| `src/config.ts`            | Typed configuration consumed by components                     |
| `src/i18n/`                | Language dictionaries and formatting helpers                   |
| `src/data/friends.ts`      | Links, icons, colors, and translated descriptions              |
| `src/data/post-options.ts` | Stable category IDs and cover styles                           |
| `src/styles/global.css`    | Theme colors, spacing, fonts, and responsive styles            |
| `src/content/posts/`       | Chinese Markdown posts; `en/` and `ja/` hold translations      |
| `public/images/`           | Local avatar and hero image                                    |
| `public/fonts/`            | Original fonts and distributed font licenses                   |
| `src/pages/`               | Routes, article pages, RSS, and sitemap compatibility endpoint |
| `tests/blog.spec.ts`       | Browser behavior and language verification                     |

The configured favicon should remain an SVG because the layout declares its MIME type as `image/svg+xml`.

## Write posts

Create `src/content/posts/en/my-first-post.md`:

```markdown
---
title: "My first post"
description: "A short summary for lists, search, and metadata."
date: 2026-09-20
lang: en
category: notes
tags: ["Astro", "Blogging"]
cover: notes
featured: false
draft: false
---

## Start here

Write something you want to keep.
```

This produces `/posts/my-first-post/` when English is selected. Japanese posts go in `src/content/posts/ja/` with `lang: ja`. Chinese posts can stay at the content root with `lang: zh-CN` (the default). The language directory is removed from the public post URL. Use matching filenames for translated versions and keep filenames unique within each language.

Only published posts whose `lang` matches the selected language appear in pages, search, RSS, and the sitemap. Missing translations are not replaced with Chinese posts. All languages are validated during a build. Files beginning with `_` are excluded from the content collection.

| Field                   | Required | Meaning                                            |
| ----------------------- | -------- | -------------------------------------------------- |
| `title` / `description` | Yes      | Title and summary                                  |
| `date`                  | Yes      | Publication date, preferably `YYYY-MM-DD`          |
| `lang`                  | No       | `zh-CN`, `en`, or `ja`; defaults to `zh-CN`        |
| `category`              | Yes      | `frontend`, `notes`, or `life`                     |
| `tags`                  | Yes      | Array of labels; may be empty                      |
| `cover`                 | Yes      | One of the cover styles below                      |
| `featured`              | No       | Featured badge and cover; defaults to `false`      |
| `draft`                 | No       | Exclude from published output; defaults to `false` |

Cover styles: `astro`, `vue`, `css`, `notes`, `life`, `typescript`, `git`, `design`. Categories use stable IDs and display translated labels. Existing Chinese category names remain accepted for compatibility. Tags and article bodies come from each Markdown file.

Posts are sorted newest first; `featured` changes presentation, not sorting. Reading time is estimated at 200 words per minute for English, 400 characters for Chinese, and 500 characters for Japanese. Search covers summaries and labels rather than entire article bodies.

## Local fonts

English uses **Noto Sans Variable**, Japanese uses **Noto Sans JP Variable**, and Chinese retains the original font with **Noto Sans SC Variable** as a fallback. Code uses **JetBrains Mono Variable** with bundled CJK fallbacks. The original Oxanium font is retained for decorative text, with language appropriate fallbacks.

Fontsource packages are bundled into local WOFF2 resources during the build. Unicode ranges let browsers load the subsets they need; no Google Fonts or external font CDN is used at runtime. English and Japanese text use these bundled fonts rather than relying on installed operating system fonts. License files for the four added families are distributed in [public/fonts/licenses/](public/fonts/licenses/).

## Guestbook behavior

The colorful guestbook saves notes in this browser’s `localStorage`. Notes are visible only to the person using that browser; they are not sent to the owner or synchronized between devices.

Five colors, sorting, removal, refresh persistence, and migration of older notes are supported. Limits are 100 notes, 24 characters for a name, and 500 for a message. Notes render as plain text. Storage failures show a message so the writer can copy their text. Clearing site data removes saved notes. To publish shared comments, connect a service or backend in `src/components/Guestbook.vue`.

## Deploy

Copy `.env.example` to `.env` and set the public origin:

```dotenv
SITE_URL=https://your-blog.example
```

Set `PUBLIC_SITE_LANGUAGE=en` here only if you want an override. Otherwise use the JSON language setting. `SITE_URL` must be an HTTP(S) root origin without credentials, a path, query, or fragment. It feeds Astro’s `site` setting, RSS, sitemap, canonical URLs, and social metadata. Rebuild after changing it. The default is `http://localhost:4321`.

### Static hosting

Use Node.js 22.12 or newer, install with `pnpm install --frozen-lockfile`, build with `pnpm build`, and publish `dist`. Set `SITE_URL` in the hosting environment. [netlify.toml](netlify.toml) includes Netlify build settings and legacy redirects.

Routes and assets assume the root of a domain or subdomain. Deploying under a path such as `/Kanade-Astro/` requires updating Astro’s base setting, links, and asset paths.

RSS is at `/rss.xml`. The official sitemap entry is `/sitemap-index.xml`; `/sitemap.xml` is retained for compatibility. Configure the host to serve `404.html` for unknown routes. `astro preview` is for inspecting builds; serve `dist/` with static hosting or a web server for production.

### Preview locally

```sh
pnpm build
pnpm preview --host 0.0.0.0 --port 4321
```

On Windows, `pnpm deploy:local` starts a hidden background preview and records logs and process information in `.preview/`. `pnpm deploy:local -Port 4322` chooses another port. To stop it, inspect `.preview/server-4321.json`, verify its `pid`, and run `Stop-Process -Id <PID>`.

### Docker

The multi stage Dockerfile builds with Node.js and serves the result through Nginx. From any directory containing the cloned project, create `.env`:

```dotenv
SITE_URL=https://your-blog.example
PUBLIC_SITE_LANGUAGE=en
KANADE_PORT=5123
```

```sh
docker compose -f compose.yaml up -d --build
docker compose -f compose.yaml ps
docker logs --tail 100 sudoria-kanade
```

Omit `PUBLIC_SITE_LANGUAGE` to use the JSON setting. The build passes the override into Astro. Rebuild after changing content, language, or domain. The container exposes the chosen host port, restarts automatically, limits log size, and has a `/healthz` health check. Stop it with `docker compose -f compose.yaml down`. On a server with legacy Compose, use `docker-compose` in place of `docker compose`.

The files `docker/ricecandy.cn.nginx.conf` and `docker/cloudflare-realip.conf` describe the original deployment. Adapt domain names, certificate locations, and upstream ports for your server.

## Checks and contributions

```sh
pnpm format:check
pnpm audit --audit-level=high
pnpm exec playwright install chromium
pnpm test
```

Linux CI can install browser system dependencies with `pnpm exec playwright install --with-deps chromium`. To use a locally installed Microsoft Edge on Windows, set `$env:PLAYWRIGHT_CHANNEL = "msedge"` before testing.

Tests cover desktop and mobile interaction, filtering, persistence, error recovery, article navigation, layout, resources, metadata, no JavaScript reading, language output, and locally loaded fonts. Run the build and tests for each language by setting `PUBLIC_SITE_LANGUAGE` consistently. GitHub Actions uses a three language matrix and a frozen lockfile. Failure artifacts are written to the ignored `test-results/` directory.

Prettier, the Astro formatter, EditorConfig, and LF line endings define source formatting. Keep translation keys consistent in all three dictionaries and preserve placeholders. Use language independent IDs in code and translate display text with `t()`.

The prior Astro 7.3 migration is documented in [docs/astro-7.3-audit.md](docs/astro-7.3-audit.md) (Chinese). TypeScript 6 matches the current checker’s supported versions. The existing override for `postcss-selector-parser` addresses a dependency advisory; review it when updating dependencies. Iconify includes eight icon collections; install the matching `@iconify-json/{prefix}` package when using another collection.

## Credits

The hero illustration, avatar, ZaoZiGongFangYueYuan font, and Oxanium font come from the original repository. The illustration preserves its creator’s mark; its [original resource](https://img2.huashi6.com/images/resource/thumbnail/2025/02/09/23269_76985257670.jpg) is referenced here. Added Noto and JetBrains Mono font families use the SIL Open Font License.

Thanks to Astro, Vue, Tailwind CSS, Iconify, Fontsource, and Playwright, and to everyone who helps improve this project.
