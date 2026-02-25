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

  const { eligibleMeals, blockedMeals } = eligibilityResult
  const eligibleCount = eligibleMeals.length
  const blockedCount = blockedMeals.length

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      {/* Status pill */}
      <div
        className="font-display font-medium text-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          whiteSpace: 'nowrap',
          width: 'fit-content',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <span style={{ fontWeight: 700, color: '#4ade80' }}>{eligibleCount}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>eligible</span>

        {blockedCount > 0 && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span style={{ fontWeight: 600, color: '#fbbf24' }} title={`${blockedCount} meals on cooldown (${cooldownDays}d)`}>{blockedCount}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>cooldown</span>
          </>
        )}

        {sessionRejectedCount > 0 && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span style={{ fontWeight: 600, color: '#c084fc' }}>{sessionRejectedCount}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>skipped</span>
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
