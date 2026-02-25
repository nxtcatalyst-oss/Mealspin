'use client'

import { useState } from 'react'
import { RefreshCw, Clock, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react'
import { format, formatDistanceToNow, subDays } from 'date-fns'
import type { SelectionHistory } from '@/types'

interface HistoryPanelProps {
  history: SelectionHistory[]
  onRefresh: () => void
  loading?: boolean
}

export default function HistoryPanel({ history, onRefresh, loading }: HistoryPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const displayItems = expanded ? history : history.slice(0, 1)

  return (
    <div className="card-glass overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'rgba(245,158,11,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gold" />
          <span
            className="text-sm font-bold font-display uppercase tracking-wider text-gold drop-shadow-sm"
          >
            Recent Selections
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg transition-colors duration-150"
          style={{ color: loading ? '#FB8500' : 'rgba(255,255,255,0.25)' }}
          title="Refresh"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : 'hover:text-gold transition-colors'} />
        </button>
      </div>

      {/* List */}
      <div className="px-3 py-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <UtensilsCrossed size={24} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 8 }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
              No selections recorded yet
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {displayItems.map((item, i) => {
              const date = new Date(item.selectedAt)
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3.5 px-4 py-3 rounded-xl"
                  style={{
                    background: i === 0 && !expanded ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${i === 0 && !expanded ? 'rgba(245,158,11,0.1)' : 'transparent'}`,
                    animation: `slide-up 0.3s ease ${i * 0.04}s both`,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: '8px',
                      background: i === 0 && !expanded ? '#FB8500' : 'rgba(255,255,255,0.15)',
                      boxShadow: i === 0 && !expanded ? '0 0 8px rgba(251,133,0,0.5)' : 'none',
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="text-[1.125rem] leading-tight font-bold truncate font-display tracking-wide"
                        style={{ color: i === 0 && !expanded ? '#FFB703' : 'rgba(255,255,255,0.9)' }}
                      >
                        {item.meal?.name ?? 'Unknown'}
                      </span>
                      <span className="text-sm uppercase font-bold tracking-wider flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {formatDistanceToNow(date, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 mt-0.5">
                      {item.meal?.category && (
                        <span className="category-badge">
                          {item.meal.category}
                        </span>
                      )}
                      <span className="text-sm font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {format(date, 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            {history.length > 1 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-2 mt-2 rounded-xl font-bold tracking-wider uppercase font-display transition-colors duration-150 hover:bg-white/5"
                style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', padding: '14px 0', minHeight: '48px' }}
              >
                {expanded
                  ? <><ChevronUp size={14} /> Show less</>
                  : <><ChevronDown size={14} /> View past weeks</>
                }
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
