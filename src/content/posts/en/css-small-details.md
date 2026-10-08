---
title: "A gentler interface: small CSS details"
description: "Space, rounded corners, soft shadows, and restrained motion give a page room to breathe."
date: 2026-09-12
lang: en
category: frontend
tags: ["CSS", "Design", "User experience"]
cover: css
---

## Begin with space

When a card feels crowded, try increasing the gaps between its contents. Group the title with its summary and give separate paragraphs enough distance to show their relationship.

Whitespace helps readers understand how the content fits together. A clear rhythm is useful even on a small screen.

## A little shadow is enough

A soft shadow can separate a card from the background. Low opacity and a hint of the theme color help it fit into the page.

```css
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 5px 24px #88566a06;
}
```

Use the border to define the edge and the shadow to suggest depth.

## Give motion a small role

A two pixel lift on hover can signal that something is clickable. Keep transitions brief enough for comfortable reading, and respect the reader’s reduced motion preference:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .card {
    transition: none;
  }
}
```

## Make keyboard focus visible

Keep a clear focus outline for keyboard users. `:focus-visible` provides a useful way to show the current position during keyboard navigation.

## Connect themes with variables

Define backgrounds, cards, text, and accent colors as shared variables. Switching a theme then updates those values consistently across components.

A comfortable interface often comes from refining these small relationships.
