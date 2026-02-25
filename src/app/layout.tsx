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
        <main className="flex-1 flex flex-col w-full">{children}</main>
      </body>
    </html>
  )
}
