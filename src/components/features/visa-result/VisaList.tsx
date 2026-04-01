"use client";

import { useState, useMemo, useEffect } from "react";

type VisaData = {
  countryEng: string;
  countryJa: string;
  region: string;
  statusRaw: string;
  category: string;
  notes: string;
};

export default function VisaList({ defaultData }: { defaultData: VisaData[] }) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [isClient, setIsClient] = useState(false);

  // LocalStorage から初期化
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("visa-favorites");
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  // LocalStorage に保存
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("visa-favorites", JSON.stringify(Array.from(favorites)));
    }
  }, [favorites, isClient]);

  const toggleFavorite = (countryEng: string) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      if (newFav.has(countryEng)) {
        newFav.delete(countryEng);
      } else {
        newFav.add(countryEng);
      }
      return newFav;
    });
  };

  const regions = ["All", ...Array.from(new Set(defaultData.map((d) => d.region))).filter(Boolean).sort()];
  const categories = ["All", "ビザ不要", "E-Visa", "OAV (到着ビザ)", "大使館", "それ以外"];

  const filteredData = useMemo(() => {
    let data = defaultData.filter((item) => {
      const matchSearch =
        item.countryJa.includes(search) ||
        item.countryEng.toLowerCase().includes(search.toLowerCase());
      const matchRegion = selectedRegion === "All" || item.region === selectedRegion;
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory || item.category.includes(selectedCategory);

      return matchSearch && matchRegion && matchCategory;
    });

    // お気に入りタブの場合はフィルタ
    if (activeTab === "favorites") {
      data = data.filter((item) => favorites.has(item.countryEng));
    }

    return data;
  }, [defaultData, search, selectedRegion, selectedCategory, favorites, activeTab]);

  return (
    <div className="flex flex-col gap-6">
      {/* タブ */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          すべて ({defaultData.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "favorites"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          ❤️ お気に入り ({favorites.size})
        </button>
      </div>

      {/* フィルター */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="国名で検索 (日本語/英語)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
        />
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm text-black bg-white"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "すべての地域" : r === "Americas" ? "南北アメリカ" : r === "Europe" ? "ヨーロッパ" : r === "Africa" ? "アフリカ" : r === "Asia" ? "アジア" : r === "Oceania" ? "オセアニア" : r === "Antarctic" ? "南極" : r}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm text-black bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "すべてのビザステータス" : c}
            </option>
          ))}
        </select>
      </div>

      {/* 結果件数 */}
      <div className="text-sm text-gray-600">
        {activeTab === "all"
          ? `検索結果: ${filteredData.length}ヶ国`
          : `お気に入り: ${filteredData.length}ヶ国`}
      </div>

      {/* グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((country) => (
          <div key={country.countryEng} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{country.countryJa}</h3>
                <p className="text-sm text-gray-500">{country.countryEng}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(country.countryEng)}
                  className="text-2xl transition-transform hover:scale-125"
                  title={favorites.has(country.countryEng) ? "お気に入り削除" : "お気に入り追加"}
                >
                  {favorites.has(country.countryEng) ? "❤️" : "🤍"}
                </button>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                  country.category === "ビザ不要" ? "bg-green-100 text-green-800" :
                  country.category.includes("E-Visa") || country.category.includes("OAV") ? "bg-blue-100 text-blue-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {country.category}
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg flex-1">
              <span className="font-semibold block mb-1 text-gray-900">詳細条件/メモ:</span>
              <p className="leading-relaxed">{country.notes || "特になし"}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">Wikipedia生データ: {country.statusRaw}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            {activeTab === "favorites"
              ? "お気に入りに登録した国はまだありません。"
              : "条件に一致する国が見つかりませんでした。"}
          </div>
        )}
      </div>
    </div>
  );
}
