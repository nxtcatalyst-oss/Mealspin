import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import Link from 'next/link'
import { Crosshair } from 'lucide-react'
import NavLinks from '@/components/NavLinks'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '700', '900'],
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
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body
        className="text-white flex flex-col font-sans"
        style={{ background: '#020205', minHeight: '100dvh' }}
      >
        <header
          className="sticky top-0 z-40 flex-shrink-0"
          style={{
            background: 'rgba(2, 2, 5, 0.75)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center group-hover:border-gold-dark transition-colors">
                <Crosshair size={18} className="text-gold" />
              </div>
              <span className="text-xl font-display font-black tracking-tight text-white drop-shadow-md">
                MealSpin
              </span>
            </Link>

            <NavLinks />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
