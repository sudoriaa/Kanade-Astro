---
title: "Readable Git history begins with a small commit"
description: "Give each commit one clear purpose. A few simple habits make everyday version control easier to follow."
date: 2026-08-28
lang: en
category: notes
tags: ["Git", "Productivity", "Development notes"]
cover: git
---

## Look at what changed

Check the working tree before editing and read the diff again before committing. These are inexpensive habits with lasting value.

```bash
git status --short
git diff
git diff --staged
```

They show the scope of changes, unstaged edits, and the contents of the next commit.

## Give each commit one purpose

Keep a navigation link fix focused, verify it, and make visual adjustments in a separate commit. A small change is easier to review and easier to investigate later.

## Describe the result

“Fix text contrast in the expanded mobile menu” explains the outcome. A commit body can add the conditions that triggered the problem and how the fix was verified.

## Leave clues for your future self

A clear history acts as a short development journal. Months later, it can preserve enough context to understand a decision without reconstructing the entire investigation.
