# アーキテクチャ設計

## 全体構成

```
[ユーザー]
    │
    ▼
[Next.js App Router]
    ├─ Server Components（データ取得・表示）
    ├─ Client Components（検索フォーム・インタラクション）
    └─ API Routes（/api/visa/*）
            │
            ▼
        [lib/visa/]          ← ビジネスロジック
            │
            ▼
        [data/visa-rules.json]  ← ビザ情報データ
            ↑
        [lib/scraper/]       ← 自動更新クローラー
```

---

## レイヤー設計

### 1. UI層（`src/app/` + `src/components/`）

**責務**：表示とユーザーインタラクションのみ

```
components/
├── ui/               # 汎用コンポーネント（Button, Badge, Input等）
└── features/
    ├── search/       # 検索フォーム関連
    ├── visa-result/  # 検索結果表示関連
    └── country-list/ # 国一覧関連
```

**ルール**
- ビジネスロジックを含めない
- データ取得は Server Components か API Routes 経由
- `use client` は最小限に留める

---

### 2. API層（`src/app/api/`）

**責務**：HTTPリクエストの受付・レスポンス整形

```
api/
└── visa/
    ├── route.ts          # GET /api/visa?country=JP → ビザ情報一覧
    └── [code]/
        └── route.ts      # GET /api/visa/TH → 特定国のビザ情報
```

**ルール**
- リクエスト・レスポンスは必ずZodでバリデーション
- ビジネスロジックは `lib/` に委譲する
- エラーは統一フォーマットで返す

```typescript
// 統一エラーフォーマット
type TApiError = {
  error: string        // ユーザー向け日本語メッセージ
  code: string         // エラーコード（ログ用）
}
```

---

### 3. ビジネスロジック層（`src/lib/`）

**責務**：ビザ情報の取得・整形・バリデーション

```
lib/
├── visa/
│   ├── get-visa-info.ts     # ビザ情報取得
│   ├── search-countries.ts  # 国名検索
│   └── format-visa-data.ts  # データ整形
└── scraper/
    ├── fetch-mofa.ts        # 外務省データ取得
    └── update-visa-rules.ts # visa-rules.json更新
```

---

### 4. データ層（`src/data/`）

**責務**：ビザ情報の永続化

```json
// visa-rules.json の構造（詳細は data-schema.md 参照）
{
  "lastUpdated": "2026-03-22T00:00:00Z",
  "countries": {
    "TH": {
      "nameJa": "タイ",
      "nameEn": "Thailand",
      "visaRequired": false,
      "stayDays": 30,
      ...
    }
  }
}
```

---

## 依存関係の方向

```
UI層 → API層 → lib層 → data層
```

**逆方向の依存は禁止**（data層がlib層を import するなど）

---

## 採用パッケージ方針

**採用する**
- `zod` — バリデーション（エージェントが扱いやすい）
- `tailwindcss` — スタイリング
- `@tanstack/react-query` — クライアントサイドのデータ取得（Phase 2以降）

**採用しない理由があるもの**
- `prisma` — JSONファイルで十分なMVP段階では不要
- `next-intl` — 初期は日本語のみのため不要
- `axios` — `fetch` で十分

---

## パフォーマンス方針

- ビザ情報は ISR（Incremental Static Regeneration）でキャッシュ
- revalidate: 86400（24時間）
- 検索サジェストは `useMemo` でメモ化

---

## 関連ドキュメント

- データスキーマ詳細 → `docs/design-docs/data-schema.md`
- 自動更新の仕組み → `docs/design-docs/auto-update.md`
