---
title: "From static content to interaction: Astro islands"
description: "Give interactive features the JavaScript they need while keeping the rest of a page easy to read and quick to load."
date: 2026-09-15
lang: en
category: frontend
tags: ["Astro", "Vue", "Performance"]
cover: astro
---

## Start with browser readable content

Most of a blog page needs no interaction. HTML can express the title, body, dates, and navigation links. Astro renders components during the build or on the server and sends the result to the browser.

Importing a Vue component does not automatically send its runtime to the reader. Without a client directive, it can render as static HTML.

## A page with a few islands

Search responds to typing, and a theme button responds to clicks. The article itself is there to be read. Hydrating those interactive areas individually is one practical use of islands.

```astro
---
import Search from "../components/header/Search.vue";
import PersonalCard from "../components/home/PersonalCard.vue";
---

<Search posts={posts} client:load />
<PersonalCard posts={posts} />
```

Here, search hydrates in the browser while the personal card produces static content. The surrounding page supplies `posts`.

## Choose when to load

- `client:load` hydrates on page load, suitable for navigation and search.
- `client:idle` waits for browser idle time, useful for lower priority widgets.
- `client:visible` hydrates when the component enters the viewport.

A component that needs no interaction can remain static.

## Design the data boundary

Data passed to a client component appears in the page output. A post list needs titles, summaries, tags, and links; it can work with a compact summary instead of an entire body.

An explicit summary type reduces the data sent to the browser and clarifies component responsibilities. The content collection provides the source; each interactive component receives the fields it uses.

## Keep each script purposeful

Static content and local interaction work well together. Giving each piece of JavaScript a clear responsibility helps keep a page comfortable to use.
