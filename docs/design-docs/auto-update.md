# 自動更新の仕組み

## 概要

Claudeのスケジュールタスク機能を使って、ビザ情報を定期的に自動更新する。
人間が手動で更新する必要がなく、常に最新の情報を保つ。

---

## アーキテクチャ

```
[Claude Cowork スケジュールタスク]
    │ 毎日 AM 6:00 実行
    ▼
[lib/scraper/fetch-mofa.ts]
    │ 外務省・各国大使館サイトから情報取得
    ▼
[lib/scraper/update-visa-rules.ts]
    │ 差分チェック → visa-rules.json 更新
    ▼
[src/data/visa-rules.json]
    │ 更新コミット → Vercel 自動デプロイ
    ▼
[本番サイト反映]
```

---

## Claudeスケジュールタスクの設定

### 設定方法
Claude Desktop（Cowork）で以下のプロンプトを `/schedule` で登録する。

```
毎日AM6時に以下を実行してください：

1. `npm run update-visa` を実行する
2. visa-rules.json に変更があれば git commit & push する
3. 変更があった国のリストをログに記録する
4. エラーがあれば内容をファイルに記録する（logs/update-error.log）

作業ディレクトリ: ~/projects/visa-saas
```

### 実行頻度
- **通常時**：毎日1回（AM 6:00）
- **緊急時**：手動実行（`npm run update-visa`）

---

## 更新スクリプト

### npm scripts（package.json）

```json
{
  "scripts": {
    "update-visa": "tsx src/scripts/update-visa-rules.ts",
    "update-visa:dry": "tsx src/scripts/update-visa-rules.ts --dry-run"
  }
}
```

### src/scripts/update-visa-rules.ts の責務

```typescript
// 1. 現在の visa-rules.json を読み込む
// 2. 外務省の各国ページから最新情報を取得
// 3. 差分を検出する
// 4. 差分がある国のみ更新する
// 5. lastUpdated を更新する
// 6. visa-rules.json を書き込む
// 7. 更新サマリーをログ出力する
```

---

## 情報ソース

| 優先度 | ソース | 用途 |
|---|---|---|
| 1 | 外務省 海外安全情報 | ビザ要否・注意事項 |
| 2 | 各国大使館公式サイト | ビザ申請方法・費用 |
| 3 | IATA Travel Centre | 入国要件の補完情報 |

---

## 更新の判断ロジック

```
情報取得
  └─ 現行データと比較
        ├─ 変更なし → スキップ（lastUpdated は更新しない）
        ├─ 軽微な変更（注意事項のみ）→ 自動更新・isVerified = true 維持
        └─ 重要な変更（ビザ要否・滞在日数）→ 更新・isVerified = false にして要確認フラグ
```

**要確認フラグ（isVerified = false）の扱い**
- サイト上で「⚠️ この情報は確認中です」バナーを表示
- 管理者に通知（将来実装）

---

## エラーハンドリング

| エラー | 対応 |
|---|---|
| スクレイピング失敗 | スキップして次の国へ。エラーログに記録 |
| JSONパース失敗 | 更新をスキップ。既存データを維持 |
| ネットワークエラー | 3回リトライ後にスキップ |
| 全体失敗 | `logs/update-error.log` に記録。既存データは**変更しない** |

---

## 鮮度の管理

```typescript
// 30日以上更新されていないデータは「古い可能性あり」として表示
const DATA_STALE_DAYS = 30

export function isDataStale(lastUpdated: string): boolean {
  const daysSinceUpdate = differenceInDays(new Date(), new Date(lastUpdated))
  return daysSinceUpdate > DATA_STALE_DAYS
}
```

UIでの表示：
- 正常：「最終更新：2026年3月22日」
- 古い：「⚠️ この情報は30日以上更新されていません。公式サイトも確認してください」

---

## 将来の拡張

- **変更通知**：ビザ要否が変わったらメールで通知するサブスク機能
- **Supabase移行**：データ量が増えたらJSONからDBへ移行
- **複数国籍対応**：日本以外のパスポート情報も追加
