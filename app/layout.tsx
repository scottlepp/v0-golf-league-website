import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'PDP Golf League',
  description: 'PDP Golf League — schedule, standings, and scorecards.',
  applicationName: 'PDP Golf League',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PDP Golf',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1B4332',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProd = process.env.NODE_ENV === 'production'
  // Always proactively unregister any previously-installed SW (e.g. the old
  // /sw.js path or a dev-mode registration), then in prod register the new one.
  const swScript = `if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => Promise.all(regs.filter((r) => !r.active || r.active.scriptURL.indexOf('/pdp-sw.js') === -1).map((r) => r.unregister())))
      .catch(() => {});
    ${
      isProd
        ? `window.addEventListener('load', () => {
             navigator.serviceWorker.register('/pdp-sw.js').catch(() => {});
           });`
        : `if (window.caches && caches.keys) {
             caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
           }`
    }
  }`

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {isProd && <Analytics />}
        <Script id="sw-lifecycle" strategy="afterInteractive">
          {swScript}
        </Script>
      </body>
    </html>
  )
}
