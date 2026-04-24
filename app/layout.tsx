// Neshnabe Connect | Wolf Flow Solutions LLC 2026

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Neshnabe Connect V1.0 | Wolf Flow Solutions LLC',
  description: 'Tribal Member Portal for the Nottawaseppi Huron Band of the Potawatomi',
}

export const viewport: Viewport = {
  themeColor: '#1A1614',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="bg-background text-white antialiased">
        {children}
      </body>
    </html>
  )
}
