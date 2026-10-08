---
title: "A Vue composable with a clear purpose"
description: "Extract a small piece of shared logic so components can concentrate on presenting the interface."
date: 2026-09-08
lang: en
category: frontend
tags: ["Vue", "TypeScript", "Component design"]
cover: vue
---

## Begin with a concrete need

If two components need the window width, write a simple implementation first and observe what they share. A useful composable has a responsibility that can be explained in a sentence.

Wait until that responsibility is understood before expanding its interface.

## Lifecycle belongs to the logic

Pair event registration with cleanup so old callbacks stop running when the component leaves the page.

```ts
import { ref, onMounted, onUnmounted } from "vue";

export function useWindowWidth() {
  const width = ref(0);
  const update = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  return { width };
}
```

The stable initial value avoids accessing `window` during server rendering. If the requirement is purely about layout, CSS media queries may already provide the behavior you need.

## Return state and actions

A composable can provide state and operations while the component chooses button colors, text, and placement. Keeping that presentation in the component makes reuse easier.

## Keep the interface understandable

Several small functions with clear responsibilities can be easier to maintain than one function with many options. The value of an abstraction is how much it helps the next reader understand.
