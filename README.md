# Todo App (React / Redux Toolkit / Firebase)

React、Redux Toolkit、そして Firebase Firestore を組み合わせた、実務志向の設計を追求した Todo アプリケーションです。
単なる機能実装に留まらず、**「UI・状態管理・ドメインロジック・テスト」の明確な責務分離**と、保守性の高いコードベースを構築することを主眼に置いています。

### [Todo App Repository (GitHub)](https://github.com/MasatakeI/todo_app.git)

- **Source Code**: [https://github.com/MasatakeI/todo_app](https://github.com/MasatakeI/todo_app)

## 🚀 主な機能

- **Todo 管理**: 追加、削除、完了/未完了の切り替え
- **優先度・整理**: 固定（Pin）、重要（Important）マーク機能
- **高度なフィルタリング**:
  - 全件 / 未完了 / 完了 / 固定中 / 重要
- **リアルタイム同期**: Firebase Firestore とのデータ同期
- **UI フィードバック**: ローディング状態の表示、Snackbar による操作結果通知、確認用モーダル

## 🛠 技術スタック

| カテゴリ             | 使用技術                                 |
| :------------------- | :--------------------------------------- |
| **Frontend**         | React, React Router (HashRouter), Vite   |
| **State Management** | Redux Toolkit, Reselect (createSelector) |
| **Backend / BaaS**   | Firebase Firestore                       |
| **UI Library**       | Material UI (一部)                       |
| **Testing**          | Vitest, React Testing Library            |
| **Lint / Tooling**   | ESLint                                   |

## 🏗 設計のこだわり

### 1. 徹底した責務分離（Layered Architecture）

各レイヤーが依存する範囲を限定し、変更に強い構造にしています。

- **UI Layer (`components/`)**: 表示とユーザー入力に特化。Page / Widget / Common の粒度で分割。
- **State Layer (`redux/`)**: 非同期処理（Thunk）と状態遷移を管理。
- **Domain Layer (`models/`)**: ビジネスロジックをカプセル化。Firebase のレスポンスをそのまま UI で使わず、ドメインモデルを介して変換。
- **Logic Layer (`selectors`)**: `reselect` を活用し、フィルタリングやソートのロジックを UI から分離。「UI は結果を受け取るだけ」の状態を維持。

### 2. Selector によるロジックの集約

計算コストの最適化とロジックの再利用性を高めるため、複雑なフィルタリングは Selector に集約しています。

```javascript
export const selectFilteredTodos = createSelector(
  [selectAllTodos, selectFilterType],
  (todos, filterType) => {
    // フィルター適用後に「固定済み」かつ「日付順」でソート
    return sortByPinnedAndDate(applyFilter(todos, filterType));
  },
);
```

### 3. テスト重視の設計

「壊れにくく、修正しやすい」アプリを目指し、複数のレイヤーでテストを実装しています。

- **Model テスト**: ドメインモデル単体での挙動やバリデーションの正確性を検証。
- **Redux テスト**: Slice、Selector、および非同期処理を担う Thunk の振る舞いを網羅的に検証。
- **Component テスト**: `renderWithStore` というカスタムユーティリティを作成し、Redux ストアと結合した状態での UI テストを簡潔に記述。
- **Middleware テスト**: アクションに反応して発火するサイドエフェクト（Snackbar の表示等）が正しくトリガーされるかを検証。

## 📂 ディレクトリ構成

```text
src/
├── components/   # UIコンポーネント (Common / Layout / Page / Widgets)
├── firebase/     # Firebase 初期化・設定
├── models/       # ドメインモデル（TodoModel.js / Error定義）
├── redux/        # 状態管理
│   ├── features/ # 各機能のスライス・Thunk・Selector
│   ├── middleware/# カスタムミドルウェア
│   └── store/    # Store構成・RootReducer
├── test/         # 各レイヤーに対応したテストコード
├── App.jsx       # ルーティング定義
└── main.jsx      # エントリーポイント
```

### 今後の改善予定（例）

- **並び替え条件の拡張**: ドラッグ＆ドロップによる自由な並び替え
- **アニメーション**: Framer Motion 等を用いた直感的な UI 演出の追加
- **アクセシビリティ**: aria 属性の整理とキーボードナビゲーションの最適化
- **E2E テスト**: Playwright 等を用いたブラウザ操作レベルの自動テスト導入

### 補足

本プロジェクトは 設計・テスト・責務分離の練習を目的としています
実務を想定した構成・命名・テスト粒度を意識しています

## 🔗 Repository & Links

---

**開発の背景と目的**
本プロジェクトは、単なるTodoアプリの作成に留まらず、**「実務で通用するスケーラブルなコード」**を追求するために開発されました。
特に、FirebaseというBaaSを利用しながらも、外部ライブラリに依存しすぎないクリーンなドメインモデルの構築や、ReduxのSelectorを駆使したパフォーマンスと責務の分離に重点を置いています。
