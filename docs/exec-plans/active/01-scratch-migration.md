# Scratch Migration プラン

## 概要
`~/.gemini/antigravity/scratch/visa-checker/` に保存されている完成済みのUIコンポーネント、ページ実装、Pythonスクレイパー、JSONデータを現在のプロジェクトに移行する。

## 実装ステップ
1. **データ・スクリプトの移行**
   - `public/visas.json` をコピー
   - `scripts/` ディレクトリをコピー
2. **UIコンポーネントの移行**
   - `app/components/VisaList.tsx` を `src/components/features/visa-result/VisaList.tsx` に配置
3. **ページの更新**
   - `src/app/page.tsx` を移行元の実装に合わせて更新（`VisaList` の読み込み等）
4. **不要ファイルの削除**
   - `01-top-page-ui.md` の削除（本ファイルで代替するため）
5. **動作確認**
   - 移行したUIが正常に表示・動作することを確認
