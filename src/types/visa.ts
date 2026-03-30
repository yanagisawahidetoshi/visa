import { z } from 'zod'

// ビザ要否ステータス
export const VisaStatusSchema = z.enum([
  'not_required',  // ビザ不要
  'required',      // ビザ必要
  'on_arrival',    // アライバルビザ
  'e_visa',        // eビザ
  'unknown',       // 要確認
])
export type TVisaStatus = z.infer<typeof VisaStatusSchema>

// ビザ取得方法
export const VisaMethodSchema = z.object({
  type: z.enum(['embassy', 'online', 'on_arrival', 'none']),
  url: z.string().url().optional(),       // 申請URL
  processingDays: z.number().optional(),  // 申請所要日数
  fee: z.number().optional(),             // 申請料（USD）
  notes: z.string().optional(),           // 補足
})
export type TVisaMethod = z.infer<typeof VisaMethodSchema>

// 入国条件
export const EntryRequirementsSchema = z.object({
  passportValidityMonths: z.number().optional(),  // パスポート残存有効期間（月）
  returnTicketRequired: z.boolean().optional(),   // 往復航空券の必要性
  proofOfFundsRequired: z.boolean().optional(),   // 残高証明の必要性
  additionalNotes: z.array(z.string()).optional(), // その他の注意事項
})
export type TEntryRequirements = z.infer<typeof EntryRequirementsSchema>

// 国別ビザ情報
export const CountryVisaInfoSchema = z.object({
  countryCode: z.string().length(2),  // ISO 3166-1 alpha-2
  nameJa: z.string(),                 // 日本語国名
  nameEn: z.string(),                 // 英語国名
  region: z.enum([                    // 地域
    'asia', 'europe', 'north_america',
    'south_america', 'africa', 'oceania', 'middle_east'
  ]),
  visaStatus: VisaStatusSchema,
  stayDays: z.number().optional(),    // ビザなし滞在可能日数
  visaMethod: VisaMethodSchema.optional(),
  entryRequirements: EntryRequirementsSchema.optional(),
  officialUrl: z.string().url().optional(),  // 外務省公式URL
  lastUpdated: z.string().datetime(),        // 最終更新日時（ISO 8601）
  isVerified: z.boolean().default(false),    // 人間が確認済みか
})
export type TCountryVisaInfo = z.infer<typeof CountryVisaInfoSchema>

// visa-rules.json 全体のスキーマ
export const VisaRulesSchema = z.object({
  schemaVersion: z.string(),          // スキーマバージョン（例: "1.0"）
  lastUpdated: z.string().datetime(), // 全体の最終更新日時
  countries: z.record(
    z.string().length(2),             // キー: ISO国コード（例: "TH"）
    CountryVisaInfoSchema
  ),
})
export type TVisaRules = z.infer<typeof VisaRulesSchema>

// APIレスポンス型
export type TVisaApiResponse = {
  data: TCountryVisaInfo
  meta: {
    requestedAt: string
    dataAge: number  // データの鮮度（日数）
    isStale: boolean // 30日以上更新なし = true
  }
}

// 検索レスポンス型
export type TVisaSearchResponse = {
  data: Pick<TCountryVisaInfo, 'countryCode' | 'nameJa' | 'nameEn' | 'visaStatus'>[]
  total: number
}
