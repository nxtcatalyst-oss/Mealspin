'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit3, Trash2, Filter, UtensilsCrossed, Loader2, CheckCircle, XCircle } from 'lucide-react'
import type { Meal } from '@/types'
import MealForm from './MealForm'

interface MealManagerProps {
  initialMeals?: Meal[]
}

interface Toast {
  message: string
  type: 'success' | 'error'
}

export default function MealManager({ initialMeals }: MealManagerProps) {
  const [meals, setMeals] = useState<Meal[]>(initialMeals ?? [])
  const [loading, setLoading] = useState(!initialMeals)
  const [showForm, setShowForm] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [toast, setToast] = useState<Toast | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadMeals = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/meals?includeDisabled=true')
      const data = await res.json()
      setMeals(data)
    } catch {
      showToast('Failed to load meals', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialMeals) loadMeals()
  }, [initialMeals, loadMeals])

  const handleSave = (saved: Meal) => {
    setMeals((prev) => {
      const exists = prev.find((m) => m.id === saved.id)
      if (exists) return prev.map((m) => (m.id === saved.id ? saved : m))
      return [saved, ...prev].sort((a, b) => a.name.localeCompare(b.name))
    })
    setShowForm(false)
    setEditingMeal(null)
    showToast(editingMeal ? 'Meal updated!' : 'Meal added!', 'success')
  }

  const handleToggle = async (meal: Meal) => {
    setTogglingId(meal.id)
    try {
      const res = await fetch(`/api/meals/${meal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !meal.enabled }),
      })
      if (res.ok) {
        const updated = await res.json()
        setMeals((prev) => prev.map((m) => (m.id === meal.id ? updated : m)))
        showToast(`"${meal.name}" ${updated.enabled ? 'enabled' : 'disabled'}`, 'success')
      }
    } catch {
      showToast('Failed to update meal', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (meal: Meal) => {
    if (!confirm(`Delete "${meal.name}"? This cannot be undone.`)) return
    setDeletingId(meal.id)
    try {
      const res = await fetch(`/api/meals/${meal.id}`, { method: 'DELETE' })
      if (res.ok) {
        setMeals((prev) => prev.filter((m) => m.id !== meal.id))
        showToast(`"${meal.name}" deleted`, 'success')
      } else {
        showToast('Failed to delete meal', 'error')
      }
    } catch {
      showToast('Failed to delete meal', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // Derived state
  const categories = ['all', ...Array.from(new Set(meals.map((m) => m.category).filter(Boolean) as string[]))]

  const filtered = meals.filter((m) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || (m.category?.toLowerCase().includes(q) ?? false)
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const enabledCount = meals.filter((m) => m.enabled).length

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="text-amber-400 font-semibold">{enabledCount}</span> enabled ·{' '}
          <span className="text-gray-400 font-medium">{meals.length}</span> total
        </p>
        <button
          onClick={() => { setEditingMeal(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            color: '#07071a',
            boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Meal
        </button>
      </div>

      {/* Form (inline) */}
      {(showForm || editingMeal) && (
        <div style={{ animation: 'slide-up 0.25s ease' }}>
          <MealForm
            meal={editingMeal}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingMeal(null) }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals..."
            className="input-dark pl-8"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-dark pl-8 pr-4 w-auto"
            style={{ appearance: 'none', minWidth: '130px' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-amber-500 opacity-60" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <UtensilsCrossed size={40} className="text-gray-700 mb-3" />
          <p className="text-gray-500 font-medium">
            {meals.length === 0
              ? 'No meals yet'
              : `No meals match "${searchQuery || categoryFilter}"`}
          </p>
          {meals.length === 0 && (
            <p className="text-xs text-gray-700 mt-1">Add your first meal to get started</p>
          )}
        </div>
      )}

      {/* Meal list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((meal, i) => {
            const tags: string[] = meal.tags
              ? (() => { try { return JSON.parse(meal.tags) } catch { return [] } })()
              : []

            return (
              <div
                key={meal.id}
                className="group flex items-start gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200"
                style={{
                  background: meal.enabled ? '#161638' : 'rgba(15,15,42,0.5)',
                  border: meal.enabled
                    ? '1px solid rgba(245,158,11,0.12)'
                    : '1px solid rgba(255,255,255,0.05)',
                  opacity: meal.enabled ? 1 : 0.6,
                  animation: `slide-up 0.3s ease ${i * 0.03}s both`,
                }}
              >
                {/* Toggle */}
                <div className="pt-0.5 flex-shrink-0">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={meal.enabled}
                      onChange={() => handleToggle(meal)}
                      disabled={togglingId === meal.id}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: meal.enabled ? '#e2e2f0' : '#6b7280' }}>
                      {meal.name}
                    </span>
                    {meal.category && (
                      <span className="category-badge text-xs">{meal.category}</span>
                    )}
                  </div>
                  {meal.description && (
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{meal.description}</p>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(245,158,11,0.07)',
                            color: 'rgba(245,158,11,0.5)',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => { setEditingMeal(meal); setShowForm(false) }}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-150"
                    title="Edit meal"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(meal)}
                    disabled={deletingId === meal.id}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
                    title="Delete meal"
                  >
                    {deletingId === meal.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium shadow-2xl"
          style={{
            background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color: toast.type === 'success' ? '#10b981' : '#f87171',
            backdropFilter: 'blur(8px)',
            animation: 'slide-up 0.3s ease',
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
