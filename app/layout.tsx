import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "RUB→KRW Calculator",
  description: "Currency exchange calculator for Russian Ruble to Korean Won with P2P rates comparison",
  applicationName: "RUB→KRW Calculator",
  keywords: ["currency", "exchange", "ruble", "won", "calculator", "P2P"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RUB→KRW Calculator",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "RUB→KRW Calculator",
    title: "RUB→KRW Calculator",
    description: "Currency exchange calculator for Russian Ruble to Korean Won",
  },
  twitter: {
    card: "summary",
    title: "RUB→KRW Calculator",
    description: "Currency exchange calculator for Russian Ruble to Korean Won",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#10b981" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RUB→KRW" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
