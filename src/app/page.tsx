import VisaList from "@/components/features/visa-result/VisaList";
import visasDataRaw from "../../public/visas.json";

export default function Home() {
  // Cast JSON to expected type array
  const visasData = visasDataRaw as {
    countryEng: string;
    countryJa: string;
    region: string;
    statusRaw: string;
    category: string;
    notes: string;
  }[];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-900">
            日本のパスポート ビザチェッカー ✈️
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            195カ国のビザ要件、滞在可能日数などの詳細条件を検索・絞り込み。
          </p>
        </header>

        {/* Render the client component for interactivity */}
        <VisaList defaultData={visasData} />
      </div>
    </main>
  );
}
