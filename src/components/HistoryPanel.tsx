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

type Tab = '7d' | '21d' | 'all'

const TABS: { id: Tab; label: string }[] = [
  { id: '7d',  label: 'This Week' },
  { id: '21d', label: '3 Weeks' },
  { id: 'all', label: 'All Time' },
]

function filterHistory(history: SelectionHistory[], tab: Tab): SelectionHistory[] {
  const now = new Date()
  if (tab === '7d')  return history.filter((h) => new Date(h.selectedAt) >= subDays(now, 7))
  if (tab === '21d') return history.filter((h) => new Date(h.selectedAt) >= subDays(now, 21))
  return history
}

export default function HistoryPanel({ history, onRefresh, loading }: HistoryPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('7d')
  const [expanded, setExpanded] = useState(false)

  const filtered = filterHistory(history, activeTab)
  const displayItems = expanded ? filtered : filtered.slice(0, 5)
  const hasMore = filtered.length > 5

  return (
    <div className="card-glass overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'rgba(245,158,11,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <Clock size={14} style={{ color: '#f59e0b' }} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: '#f59e0b' }}
          >
            Recent Selections
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg transition-colors duration-150"
          style={{ color: loading ? '#f59e0b' : 'rgba(255,255,255,0.25)' }}
          title="Refresh"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pt-3 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setExpanded(false) }}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={
              activeTab === tab.id
                ? { background: 'rgba(245,158,11,0.14)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }
                : { background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.3)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-3 pb-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <UtensilsCrossed size={24} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 8 }} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              No selections in this period
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayItems.map((item, i) => {
              const date = new Date(item.selectedAt)
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: i === 0 ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.1)' : 'transparent'}`,
                    animation: `slide-up 0.3s ease ${i * 0.04}s both`,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                      background: i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                      boxShadow: i === 0 ? '0 0 6px rgba(245,158,11,0.6)' : 'none',
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-sm font-semibold truncate"
                        style={{ color: i === 0 ? '#fbbf24' : 'rgba(255,255,255,0.75)' }}
                      >
                        {item.meal?.name ?? 'Unknown'}
                      </span>
                      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {formatDistanceToNow(date, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.meal?.category && (
                        <span className="category-badge" style={{ fontSize: '0.65rem' }}>
                          {item.meal.category}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {format(date, 'EEE MMM d')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            {hasMore && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                {expanded
                  ? <><ChevronUp size={13} /> Show less</>
                  : <><ChevronDown size={13} /> {filtered.length - 5} more</>
                }
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
