---
title: "TypeScript notes: types at the data boundary"
description: "Validate external data and give components inputs they can trust. Clear boundaries make types useful."
date: 2026-09-02
lang: en
category: frontend
tags: ["TypeScript", "Development notes"]
cover: typescript
---

## Type checking happens before runtime

TypeScript catches many structural mistakes, but a type annotation does not inspect a network response or browser storage. An `as` assertion asks the compiler to trust a claim.

Treat data from storage, forms, or remote services as unknown until it has been checked.

## Validate before using

```ts
type Note = { id: string; content: string };

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;
  return (
    "id" in value &&
    typeof value.id === "string" &&
    "content" in value &&
    typeof value.content === "string"
  );
}

function parseNote(raw: string): Note | null {
  try {
    const value: unknown = JSON.parse(raw);
    return isNote(value) ? value : null;
  } catch {
    return null;
  }
}
```

This handles both invalid JSON and an unexpected structure. A schema validation library can centralize constraints for larger objects.

## Give failure a normal path

Storage may be empty, old records may use different fields, and persistence may be disabled. Handling these as ordinary branches helps the rest of the interface keep working.

## Simple types help too

A post summary can explicitly contain its title, date, category, and link. Passing that summary to a component gives its data boundary a clear contract.
