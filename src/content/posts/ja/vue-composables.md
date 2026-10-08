---
title: "役割がわかる Vue Composable を書く"
description: "共有する処理を小さく取り出し、コンポーネントが画面の表示に集中できるようにします。"
date: 2026-09-08
lang: ja
category: frontend
tags: ["Vue", "TypeScript", "コンポーネント設計"]
cover: vue
---

## 具体的な必要性から始める

二つのコンポーネントで画面幅を知りたいなら、まず簡単に実装し、どの処理が共通しているかを確かめます。Composable の役割を一文で説明できると、使い方もわかりやすくなります。

役割が見えてから、必要に応じてインターフェースを広げます。

## ライフサイクルも処理の一部

イベントの登録と解除を対にします。コンポーネントがページから離れたあとに、古いコールバックが残らないようにします。

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

初期値を固定し、マウント後に `window` を参照すると、サーバー描画時にも扱いやすくなります。レイアウトだけなら、CSS のメディアクエリで対応できる場合もあります。

## 状態と操作を返す

Composable は状態と操作を提供し、色や文章、配置はコンポーネントで決めます。表示の判断を画面側に置くと再利用しやすくなります。

## 理解しやすい入口を作る

役割が明確な小さい関数は、選択肢が多い一つの関数より管理しやすいことがあります。次に読む人が処理を理解しやすいか、という視点で抽象化を考えます。
