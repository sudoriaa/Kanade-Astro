---
title: "TypeScript メモ：データの境界に型を書く"
description: "外部のデータを検証し、コンポーネントに信頼できる入力を渡すための基本を整理します。"
date: 2026-09-02
lang: ja
category: frontend
tags: ["TypeScript", "開発ノート"]
cover: typescript
---

## 型検査は実行前に行われる

TypeScript は構造の間違いを見つける助けになりますが、型注釈そのものは通信結果やブラウザの保存内容を検査しません。`as` はコンパイラにその型だと伝える指定です。

ストレージ、フォーム、外部 API から来た値は、確認するまで未知の値として扱います。

## 検証してから使う

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

JSON の形式エラーと、構造が合わない場合の両方に対応しています。複雑なデータには、スキーマ検証ライブラリで制約をまとめる方法もあります。

## 失敗も通常の分岐にする

ストレージが空だったり、古い形式のデータが残っていたり、保存が無効だったりすることもあります。こうした場合を処理しておけば、他の機能を引き続き使えます。

## 小さな型にも意味がある

記事の要約にタイトル、日付、カテゴリ、リンクを明示すると、コンポーネントが必要なデータを受け取れます。型はその境界と約束を説明する役割を持ちます。
