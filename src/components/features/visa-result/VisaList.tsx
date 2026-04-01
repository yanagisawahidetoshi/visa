"use client";

import { useState, useMemo } from "react";

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

  const regions = ["All", ...Array.from(new Set(defaultData.map((d) => d.region))).filter(Boolean).sort()];
  const categories = ["All", "ビザ不要", "E-Visa", "OAV (到着ビザ)", "大使館", "それ以外"];

  const filteredData = useMemo(() => {
    return defaultData.filter((item) => {
      const matchSearch =
        item.countryJa.includes(search) ||
        item.countryEng.toLowerCase().includes(search.toLowerCase());
      const matchRegion = selectedRegion === "All" || item.region === selectedRegion;
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory || item.category.includes(selectedCategory);

      return matchSearch && matchRegion && matchCategory;
    });
  }, [defaultData, search, selectedRegion, selectedCategory]);

  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((country) => (
          <div key={country.countryEng} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{country.countryJa}</h3>
                <p className="text-sm text-gray-500">{country.countryEng}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                country.category === "ビザ不要" ? "bg-green-100 text-green-800" :
                country.category.includes("E-Visa") || country.category.includes("OAV") ? "bg-blue-100 text-blue-800" :
                "bg-red-100 text-red-800"
              }`}>
                {country.category}
              </span>
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
            条件に一致する国が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
