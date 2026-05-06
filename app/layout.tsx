import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Bitcoin Names',
  description: 'Bitcoin-native name registry. Quantum-secure. Powered by Orobit.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        {/* Exact original fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hubot+Sans:ital,wdth,wght@0,75..125,200..900;1,75..125,200..900&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning
        className="antialiased bg-bn-page text-bn-ink overflow-x-hidden min-h-screen"
        style={{ fontFamily: "'Hubot Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div className="pointer-events-none fixed inset-0 -z-10 bn-dot-grid opacity-35" />
        <div className="pointer-events-none fixed -z-10 left-[-16%] top-[-12%] h-[46vh] w-[46vw] rounded-full bn-orange-glow-soft blur-2xl" />
        <div className="pointer-events-none fixed -z-10 right-[-22%] top-[10%] h-[56vh] w-[46vw] rounded-full bn-orange-glow-soft blur-2xl" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
