import type { Metadata } from 'next'
import './globals.css'
import PoweredByBTV from './components/PoweredByBTV'
import ChatBot from './components/ChatBot'

export const metadata: Metadata = {
  title: 'Western N Third Building Materials | Wilmington NC',
  description: 'Premium industrial-grade building materials in Wilmington, NC. Buy, sell, and trade quality lumber, metals, hardware, tools, flooring, and doors.',
  keywords: 'building materials Wilmington NC, lumber Wilmington, industrial materials, buy sell trade building supplies, Western N Third',
  openGraph: {
    type: 'website',
    title: 'Western N Third Building Materials | Wilmington NC',
    description: 'Buy • Sell • Trade — Premium industrial building materials in downtown Wilmington, NC.',
    url: 'https://western-n-third.com',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Western N Third Building Materials | Wilmington NC',
    description: 'Buy • Sell • Trade — Premium industrial building materials in downtown Wilmington, NC.',
    images: ['/og-image.jpg'],
  },
  other: {
    'geo.region': 'US-NC',
    'geo.placename': 'Wilmington, North Carolina',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PoweredByBTV />
        <ChatBot />
      </body>
    </html>
  )
}
