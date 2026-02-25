'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isMeals = pathname === '/meals'

  const activeStyle = {
    background: 'rgba(245,158,11,0.12)',
    border: '1px solid rgba(245,158,11,0.3)',
    color: '#fbbf24',
  }

  const inactiveStyle = {
    background: 'transparent',
    border: '1px solid transparent',
    color: 'rgba(255,255,255,0.45)',
  }

  return (
    <nav className="flex items-center gap-1">
      <Link
        href="/"
        className="px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-150"
        style={isHome ? activeStyle : inactiveStyle}
      >
        Spin
      </Link>
      <Link
        href="/meals"
        className="px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-150"
        style={isMeals ? activeStyle : inactiveStyle}
      >
        Meals
      </Link>
    </nav>
  )
}
