import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'ビザチェッカー - 195カ国のビザ要件を検索',
  description: '日本のパスポート保有者向け。195カ国のビザ要件、滞在可能日数などの詳細条件を検索・絞り込みできます。',
  keywords: 'ビザ、パスポート、渡航、ビザ要件、滞在日数',
  openGraph: {
    title: 'ビザチェッカー - 195カ国のビザ要件を検索',
    description: '日本のパスポート保有者向け。195カ国のビザ要件、滞在可能日数などの詳細条件を検索・絞り込みできます。',
    type: 'website',
    url: 'https://your-domain.com',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ビザチェッカー - 195カ国のビザ要件を検索',
    description: '日本のパスポート保有者向け。195カ国のビザ要件、滞在可能日数などの詳細条件を検索・絞り込みできます。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'Ny09IPFr_Pv-3iA28AChDnhw2v_OE9HTEKq9AzJ65tE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
