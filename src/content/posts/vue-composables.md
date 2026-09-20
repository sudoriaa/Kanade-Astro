---
title: "写一个刚刚好的 Vue Composable"
description: "从重复逻辑里提取边界，用一个小小的组合式函数，让组件重新专注于界面。"
date: 2026-09-08
category: "前端开发"
tags: ["Vue", "TypeScript", "组件设计"]
cover: "vue"
---
## 从具体需求开始

当两个组件都需要监听窗口宽度时，可以先写出两份简单实现，再观察它们真正共享了什么。过早抽象通常会把尚未稳定的需求固定下来。

一个好的 composable，应该有一个清晰、能够用一句话说明的职责。

## 生命周期是逻辑的一部分

监听事件时，注册与清理必须成对出现。否则组件离开页面之后，旧回调仍可能继续工作。

```ts
import { ref, onMounted, onUnmounted } from "vue";

export function useWindowWidth() {
  const width = ref(0);
  const update = () => { width.value = window.innerWidth; };

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

这个例子在挂载之前保持一个稳定初始值，避免在服务端渲染阶段访问 `window`。如果页面布局可以用 CSS 完成，优先使用媒体查询。

## 返回数据，而不是控制整个界面

组合式函数可以提供状态与操作，但不必知道按钮是什么颜色、提示文字放在哪里。把表现层留给组件，复用才会自然。

## 留下容易理解的接口

比起一个支持十几种选项的万能函数，三个职责明确的小函数通常更容易维护。抽象的价值，在于让下一位阅读者少想一点。