'use client'

import { format } from 'date-fns'
import { Plus, RotateCcw, Zap } from 'lucide-react'
import Link from 'next/link'
import type { NoEligibleMealsResponse } from '@/types'

interface NoEligibleMealsPanelProps {
  response: NoEligibleMealsResponse
  currentCooldownDays: number
  onReduceCooldown: (days: number) => void
  onResetSession: () => void
  sessionRejectedCount: number
}

export default function NoEligibleMealsPanel({
  response,
  currentCooldownDays,
  onReduceCooldown,
  onResetSession,
  sessionRejectedCount,
}: NoEligibleMealsPanelProps) {
  const { eligibilityResult } = response
  const blocked = eligibilityResult.blockedMeals.slice(0, 6)

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="rounded-3xl overflow-hidden text-center"
        style={{
          background: 'linear-gradient(160deg, #1a1a38 0%, #0f0f2a 100%)',
          border: '1px solid rgba(245,158,11,0.15)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top bar */}
        <div
          className="h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)' }}
        />

        <div className="p-8">
          {/* Icon */}
          <div className="text-5xl mb-4">😴</div>

          <h2
            className="text-2xl font-black mb-2"
            style={{ fontFamily: 'var(--font-playfair)', color: '#fbbf24' }}
          >
            No eligible meals
          </h2>

          <p className="text-gray-400 text-sm mb-6">{response.reason}</p>

          {/* Blocked meals preview */}
          {blocked.length > 0 && (
            <div className="mb-6 text-left space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3 text-center">
                Meals on cooldown
              </p>
              {blocked.map((b) => (
                <div
                  key={b.meal.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span className="text-sm text-gray-300 truncate">{b.meal.name}</span>
                  <span
                    className="text-xs ml-3 flex-shrink-0 px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.2)',
                      color: 'rgba(245,158,11,0.7)',
                    }}
                  >
                    {b.daysUntilUnblocked}d left
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2.5">
            {currentCooldownDays > 14 && (
              <button
                onClick={() => onReduceCooldown(14)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  color: '#07071a',
                  boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
                }}
              >
                <Zap size={16} />
                Try with 14-day cooldown
              </button>
            )}

            {currentCooldownDays > 7 && (
              <button
                onClick={() => onReduceCooldown(7)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  color: '#fbbf24',
                }}
              >
                <Zap size={16} />
                Try with 7-day cooldown
              </button>
            )}

            {sessionRejectedCount > 0 && (
              <button
                onClick={onResetSession}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  color: '#c084fc',
                }}
              >
                <RotateCcw size={16} />
                Reset session rejections ({sessionRejectedCount})
              </button>
            )}

            <Link
              href="/meals"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <Plus size={16} />
              Add more meals
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
