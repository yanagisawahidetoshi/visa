# AGENTS.md

このファイルはエージェントへの**地図**です。
実装の詳細はここに書かず、`docs/` 以下の各ドキュメントを参照してください。

---

## このプロダクトについて

**ビザ情報SaaS** — 日本人旅行者向けに、渡航先のビザ要否・取得方法・費用・注意事項を即座に提供するWebサービス。

> 詳細: `docs/product-specs/overview.md`

---

## 技術スタック

| 領域 | 技術 |
|------|------|
| フレームワーク | Next.js 15 App Router |
| 言語 | TypeScript（strict mode） |
| スタイリング | Tailwind CSS |
| バックエンド | Next.js API Routes のみ |
| データ管理 | JSONファイル or Supabase（将来） |
| デプロイ | Vercel |
| 言語対応 | 日本語のみ（初期） |

> 詳細: `docs/design-docs/architecture.md`

---

## アーキテクチャの原則

1. **App Router を使う** — `pages/` は使わない
2. **Server Components を優先する** — クライアントコンポーネントは必要な箇所のみ
3. **API Routes はシンプルに** — ビジネスロジックは `lib/` に切り出す
4. **型は厳密に** — `any` 禁止、境界では必ず Zod でバリデーション
5. **ファイルサイズ制限** — 1ファイル300行以内。超えたら分割する

> 詳細: `docs/design-docs/architecture.md`

---

## ディレクトリ構成

```
src/
├── app/                   # App Router
│   ├── page.tsx           # トップページ（検索UI）
│   ├── result/            # 検索結果ページ
│   └── api/               # API Routes
│       └── visa/
│           └── route.ts   # ビザ情報取得API
├── components/            # UIコンポーネント
│   ├── ui/                # 汎用コンポーネント
│   └── features/          # 機能別コンポーネント
├── lib/                   # ビジネスロジック
│   ├── visa/              # ビザ情報取得・整形
│   └── scraper/           # 情報クロール処理
├── types/                 # 型定義
│   └── visa.ts
└── data/                  # ビザ情報JSONデータ
    └── visa-rules.json
```

---

## コーディングルール

### 命名規則
- コンポーネント: PascalCase（`VisaSearchForm.tsx`）
- 関数・変数: camelCase（`getVisaInfo`）
- 型・インターフェース: PascalCase + `I` or `T` prefix（`TVisaInfo`）
- 定数: UPPER_SNAKE_CASE（`DEFAULT_TIMEOUT`）

### 禁止事項
- `any` 型の使用
- `console.log` の本番コードへの混入（`console.error` は可）
- `pages/` ディレクトリの使用
- 直接的なDOM操作

### 必須事項
- 全APIレスポンスはZodでバリデーション
- エラーは必ずユーザーフレンドリーな日本語メッセージで返す
- 新しいコンポーネントには必ずStorybookのstoryを追加（将来対応可）

---

## タスクの進め方

1. **タスクを受け取ったら** → `docs/exec-plans/active/` に実行プランを作成する
2. **実装前に** → 関連する `docs/product-specs/` と `docs/design-docs/` を必ず読む
3. **実装中は** → 1PRに1つの機能。大きければ分割する
4. **実装後は** → `docs/exec-plans/active/` のプランを `completed/` に移動し、学びを記録する

> 詳細: `docs/exec-plans/README.md`

---

## 知識ベースのナビゲーション

| 知りたいこと | 参照先 |
|---|---|
| プロダクトの全体像・機能一覧 | `docs/product-specs/overview.md` |
| 画面設計・UXフロー | `docs/product-specs/ux-flow.md` |
| アーキテクチャ詳細 | `docs/design-docs/architecture.md` |
| データ構造・スキーマ | `docs/design-docs/data-schema.md` |
| 情報自動更新の仕組み | `docs/design-docs/auto-update.md` |
| 現在進行中のタスク | `docs/exec-plans/active/` |
| 完了済みタスクと学び | `docs/exec-plans/completed/` |
| 技術的負債リスト | `docs/exec-plans/tech-debt-tracker.md` |

---

## エージェントへの重要な注意事項

- **このファイルは目次** — 詳細はすべて `docs/` にある
- **わからないことがあれば** — 推測で実装せず、該当する `docs/` を先に読む
- **ドキュメントが古い・存在しない場合** — 実装前にドキュメントを作成・更新してから進める
- **人間への確認が必要な場合** — 実装を止めて質問する（曖昧なまま進めない）
