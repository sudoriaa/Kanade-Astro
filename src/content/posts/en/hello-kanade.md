---
title: "Hello, Kanade: a place for the things we love"
description: "A little home for words, from the first line of code to a complete blog. The story of this site, and a new beginning."
date: 2026-09-18
lang: en
category: notes
tags: ["Astro", "Blogging", "Project journal"]
cover: astro
featured: true
---

> This is Kanade’s first example post. May the things we record find us again on some future day.

## Why write a blog?

Feeds move so quickly that something saved yesterday can disappear from view today. I wanted a slower place to keep thoughts about code, the steps taken to solve a problem, and small moments from ordinary days.

A blog does not need a large archive to begin. A note, a photograph, or a question finally understood is worth recording. Writing the first sentence is a useful beginning.

## Building a small home with Astro

Kanade uses Astro to generate static pages and Vue for the parts that need interaction. Post bodies become HTML during the build, ready to read immediately. Search, category filters, and theme switching run in the browser.

The project follows a few simple conventions:

- Posts live in Markdown files, with content maintained separately from the interface.
- Shared color variables keep light and dark themes consistent.
- Categories, tags, and post counts come from the content collection.
- The hero image, avatar, and fonts are local resources.

Create a Markdown file in `src/content/posts/en/` with frontmatter like this:

```yaml
---
title: "My next note"
description: "Describe this post in a sentence or two."
date: 2026-09-20
lang: en
category: notes
tags: ["Blogging"]
cover: notes
---
```

Write the body below it. On the next build, the post joins the list, search results, and RSS feed when English is selected.

## About the name

Kanade comes from the Japanese character 奏, associated with playing music. Code, music, walks, and writing can be different parts of a melody of our own.

That is the idea behind this little site: a place where each piece of writing can settle.

## Keep writing, little by little

I hope to record discoveries in frontend development, useful tools, reading, and fragments of everyday life. If you happen to stop by, take a moment at the [guestbook](/messages/).

May we all find a little room for the things we love.
