# Todoアプリ（React / Redux Toolkit / Vitest）

## 概要

本プロジェクトは **React + Redux Toolkit** を用いて実装した Todo 管理アプリです。
「責務分離」「テストしやすい設計」「段階的な実装」を重視して構築しています。

- Todo の追加 / 削除 / 完了切り替え
- フィルタリング（全件 / 未完了 / 完了）
- 非同期処理（save,fetch / delete / toggle）
- エラー通知（Snackbar）

UI・状態管理・副作用を明確に分離し、**Widget / Page / Hook / Redux** の役割がはっきりした構成になっています。

---

## 使用技術

- **React**
- **Redux Toolkit**
- **React Router（HashRouter）**
- **Vitest**
- **React Testing Library**
- **Material UI（Snackbar / Modal など）**

---

## ディレクトリ構成（抜粋）

```
src/
├─ components/
│  ├─ common/        # Button, Modal, Snackbar などの汎用UI
│  ├─ widgets/       # TodoList, TodoCard, Filter など
│  ├─ page/          # Home, Main（ルーティング単位）
│  └─ layout/        # Header, Footer
│
├─ redux/
│  ├─ features/
│  │  ├─ todos/      # todosSlice, thunks, selectors
│  │  ├─ filter/     # filterSlice, selectors
│  │  └─ snackbar/   # snackbarSlice
│  └─ store.js
│
├─ test/
│  ├─ components/    # コンポーネント / hook テスト
│  ├─ redux/         # slice / selector テスト
│  └─ utils/         # renderWithStore など
```

---

## 設計方針

### 1. 責務分離

- **Page**: 画面単位・ルーティング単位の責務
- **Widget**: UI とユーザー操作
- **Custom Hook**: UI から切り離したロジック（例: `useTodoList`）
- **Redux**: グローバルな状態・副作用管理

UI コンポーネントは Redux を直接操作せず、Hook 経由で振る舞います。

---

### 2. 非同期処理の扱い

- Redux Toolkit の `createAsyncThunk` を使用
- 成功 / 失敗の責務は slice 側で管理
- エラーは Snackbar 用 slice に集約

---

### 3. テスト戦略

#### テストの粒度

| 対象        | テスト内容               |
| ----------- | ------------------------ |
| Widget      | 表示・イベント発火       |
| Custom Hook | dispatch / state 制御    |
| Redux Slice | reducer / thunk          |
| Page        | mount 時の副作用・構成   |
| App         | ルーティング・レイアウト |

#### 方針

- **責務をまたぐテストは書かない**
- 表示確認は `getByText`
- 非表示確認は `queryByText`
- Redux を使うテストでは `renderWithStore` を共通化

---

## 現在の実装状況

- [x] Todo CRUD
- [x] フィルタリング
- [x] 非同期処理
- [x] Snackbar によるエラー通知
- [x] コンポーネント / Hook / Redux のテスト
- [ ] UI（CSS）の調整
- [ ] E2E テスト（将来対応）

---

## 補足

本プロジェクトは **学習・ポートフォリオ用途**を想定しており、
「なぜこの設計にしたか」「どこをテストしているか」を説明できる構成を意識しています。

---
