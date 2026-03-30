export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ビザ情報SaaS
          </h1>
          <p className="text-xl text-gray-600">
            日本人旅行者向けビザ情報を即座に提供します
          </p>
        </header>

        <section className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            渡航先を検索
          </h2>
          <p className="text-gray-600 mb-6">
            検索機能は開発中です。AGENTS.md とドキュメントに従って実装を進めています。
          </p>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              ✓ Next.js 15 (App Router) セットアップ完了<br />
              ✓ TypeScript strict mode 有効<br />
              ✓ Tailwind CSS 統合完了<br />
              ✓ Zod インストール完了<br />
              ✓ データスキーマ定義完了<br />
              ✓ サンプルデータ（タイ、アメリカ、シンガポール）配置完了
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
