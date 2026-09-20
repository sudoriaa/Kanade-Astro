---
title: "TypeScript 笔记：把类型写在数据的边界"
description: "比起为所有变量添加注解，更重要的是让外部数据经过验证，让组件拿到可信的输入。"
date: 2026-09-02
category: "前端开发"
tags: ["TypeScript", "开发笔记"]
cover: "typescript"
---
## 类型检查发生在运行之前

TypeScript 能帮助我们发现许多结构错误，但类型注解本身不会检查网络响应或本地存储的内容。一个 `as` 断言，只是告诉编译器相信你。

当数据来自浏览器存储、表单或远程接口时，应当先把它当作未知值。

## 先验证，再使用

```ts
type Note = { id: string; content: string };

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) return false;
  return "id" in value && typeof value.id === "string"
    && "content" in value && typeof value.content === "string";
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

这个函数同时处理了 JSON 格式错误和结构不匹配两种情况。对于复杂对象，可以使用 schema 验证库，让约束更集中。

## 为失败准备正常路径

存储可能被清空，字段可能来自旧版本，用户也可能禁用了持久化。把这些情况视为正常分支，界面才不会因为一个小功能的失败而完全失效。

## 简单类型也有价值

给组件传入文章摘要时，可以明确包含标题、日期、分类和链接，不把整个数据库对象直接透传。类型在这里承担的职责，是解释边界与约定。