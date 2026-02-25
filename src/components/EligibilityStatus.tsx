'use client'

import { useState } from 'react'
import { Settings, ChevronDown, Info } from 'lucide-react'
import type { EligibilityResult } from '@/types'

interface EligibilityStatusProps {
  eligibilityResult: EligibilityResult | null
  sessionRejectedCount: number
  cooldownDays: number
  onCooldownChange?: (days: number) => void
}

const COOLDOWN_OPTIONS = [7, 14, 21, 28, 42]

export default function EligibilityStatus({
  eligibilityResult,
  sessionRejectedCount,
  cooldownDays,
  onCooldownChange,
}: EligibilityStatusProps) {
  const [showSettings, setShowSettings] = useState(false)

  if (!eligibilityResult) {
    return (
      <div className="h-8 flex items-center gap-2">
        <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
      </div>
    )
  }

  const { eligibleMeals, blockedMeals, totalEnabled } = eligibilityResult
  const eligibleCount = eligibleMeals.length
  const blockedCount = blockedMeals.length

  return (
    <div className="relative flex flex-col sm:flex-row items-center gap-4 justify-center">
      {/* Status pill */}
      <div
        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-display tracking-wide uppercase font-medium"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span>
          <span className="font-bold tracking-wider text-green-400/80 text-base">{eligibleCount}</span>
          <span className="text-white/40"> eligible</span>
        </span>

        {blockedCount > 0 && (
          <>
            <span className="text-white/10">·</span>
            <span title={`${blockedCount} meals blocked – selected within last ${cooldownDays} days`}>
              <span className="font-semibold text-gold">{blockedCount}</span>
              <span className="text-white/40"> cooldown</span>
            </span>
          </>
        )}

        {sessionRejectedCount > 0 && (
          <>
            <span className="text-white/10">·</span>
            <span>
              <span className="font-semibold text-accent-light">{sessionRejectedCount}</span>
              <span className="text-white/40"> rejected</span>
            </span>
          </>
        )}
      </div>

      {/* Cooldown settings */}
      {onCooldownChange && (
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display tracking-widest uppercase font-medium text-white/40 hover:text-gold hover:bg-gold/10 transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Settings size={12} />
            <span>{cooldownDays}d cooldown</span>
            <ChevronDown size={12} className={`transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>

          {showSettings && (
            <div
              className="absolute bottom-full mb-2 left-0 rounded-xl overflow-hidden z-20 min-w-[160px]"
              style={{
                background: '#0D0D14',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,133,0,0.1)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cooldown Period</p>
              </div>
              {COOLDOWN_OPTIONS.map((days) => (
                <button
                  key={days}
                  onClick={() => {
                    onCooldownChange(days)
                    setShowSettings(false)
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-display transition-colors duration-150"
                  style={{
                    background: days === cooldownDays ? 'rgba(251,133,0,0.1)' : 'transparent',
                    color: days === cooldownDays ? '#FFB703' : 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={(e) => {
                    if (days !== cooldownDays) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={(e) => {
                    if (days !== cooldownDays) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span>{days} days</span>
                  {days === cooldownDays && <span className="text-gold text-xs">✓</span>}
                </button>
              ))}
              <div className="px-3 py-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] text-white/30 flex items-start gap-1 leading-tight">
                  <Info size={10} className="mt-0.5 flex-shrink-0" />
                  Meals selected within this window are excluded
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
