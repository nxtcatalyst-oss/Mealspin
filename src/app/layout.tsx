import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MealSpin — What\'s for dinner?',
  description: 'Spin the wheel. Decide your fate. Eat well.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MealSpin',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // needed for iPhone notch/safe area
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body
        className="text-white flex flex-col"
        style={{ background: '#05050f', minHeight: '100dvh' }}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-40 flex-shrink-0"
          style={{
            background: 'rgba(5, 5, 15, 0.88)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          <div className="max-w-lg mx-auto px-4 h-12 sm:h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎰</span>
              <span
                className="text-lg sm:text-xl font-black tracking-tight"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  background: 'linear-gradient(135deg, #fef3c7, #fbbf24, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                MealSpin
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Spin
              </Link>
              <Link
                href="/meals"
                className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  color: '#fbbf24',
                }}
              >
                Meals
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
