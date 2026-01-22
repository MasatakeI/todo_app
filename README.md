# Todoアプリ（React / Redux Toolkit / Firebase）

## 概要

本プロジェクトは **Firebase Firestore** をバックエンドに利用した Todo アプリです。

現時点では、**Model 層の実装および単体テストが完了**しており、
外部サービス（Firestore）とのやり取りやドメインルールを安全に扱える設計を構築しています。

UI や Redux 層は今後実装予定であり、
本 README は **Model 実装完了時点での設計思想と責務**を明確にすることを目的としています。

---

## 技術スタック

- JavaScript (ES2022)
- Firebase Firestore
- Vitest

---

## ディレクトリ構成（抜粋）

```
src/
├─ models/
│  ├─ TodoModel.js
│  └─ errors/
│     └─ ModelError.js
│
└─ test/
   └─ Models/
      └─ TodoModel.test.js
```

---

## 設計方針

### 1. Model 層をドメインの防波堤として扱う

Model 層は以下の責務のみを持ちます。

- Firestore との直接的な通信
- データ構造の検証と整形
- 外部 SDK の例外をアプリ用エラーに正規化

Redux や UI 層は **Model が返すデータは常に正しい** という前提で実装できるよう設計しています。

---

### 2. 外部エラーの正規化（ModelError）

Firestore やその他外部 API が投げる例外は、
すべて `ModelError` に変換してから上位層へ返却します。

```js
export const MODEL_ERROR_CODE = {
  VALIDATION: "VALIDATION",
  REQUIRED: "REQUIRED",
  INVALID_DATA: "INVALID_DATA",
  NOT_FOUND: "NOT_FOUND",
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
};
```

- UI / Redux は `code` のみを見て制御可能
- エラーメッセージや実装変更にテストが依存しない
- i18n や表示切り替えが容易

---

### 3. Model は "壊れたデータ" を返さない

Firestore から取得したデータであっても、
以下の条件を満たさない場合は **即座に例外をスロー** します。

- 必須フィールドが存在しない
- 型が想定と異なる
- ビジネスルールに違反している

これにより、アプリ全体で以下を保証します。

> "UI に渡るデータは常に安全である"

---

## 実装済み Model API

### createTodo

```ts
createTodo(id: string | number, data: unknown): Todo
```

- Firestore の生データを Todo ドメインモデルへ変換
- 不正なデータの場合 `INVALID_DATA` をスロー

---

### saveTodo

```ts
saveTodo({ body: string }): Promise<Todo>
```

- Todo を新規作成
- 空文字の場合 `REQUIRED`
- 保存後に再取得し、整形済みデータを返却

---

### fetchTodos

```ts
fetchTodos(): Promise<Todo[]>
```

- Firestore 上の Todo 一覧を取得
- データが存在しない場合は空配列を返却
- 不正なデータが含まれる場合は例外をスロー

---

### deleteTodo

```ts
deleteTodo(id: string): Promise<Todo>
```

- 削除前に対象データを取得
- 存在しない場合 `NOT_FOUND`
- 削除に成功した Todo を返却

---

### toggleTodo

```ts
toggleTodo(id: string): Promise<Todo>
```

- completed フラグを反転
- 対象が存在しない場合 `NOT_FOUND`

---

## テスト方針

### 単体テストの目的

- Model が **正しいデータのみを返す** ことを保証
- 外部 SDK の失敗をすべて吸収できているかを確認
- 副作用（削除・更新）が誤って発生しないことを検証

---

### テストの特徴

- Firestore SDK はすべて mock
- 実装詳細ではなく **振る舞い** を検証
- エラーは message ではなく `code` でアサート

```js
await expect(fetchTodos()).rejects.toMatchObject({
  code: MODEL_ERROR_CODE.UNKNOWN,
});
```

---

## 今後の予定

- Redux Toolkit による状態管理の実装
- Thunk 層では Model を完全に mock してテスト
- UI コンポーネントの追加

---

## 補足

本プロジェクトでは、
**実装より先にテスト可能な設計を行うこと** を重視しています。

Model 層でドメインを守ることで、
Redux や UI 層をシンプルに保つことを目的としています。
