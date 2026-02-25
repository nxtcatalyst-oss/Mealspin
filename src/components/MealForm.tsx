'use client'

import { useState } from 'react'
import { X, Plus, Loader2 } from 'lucide-react'
import type { Meal, MealFormData } from '@/types'

interface MealFormProps {
  meal?: Meal | null
  onSave: (meal: Meal) => void
  onCancel: () => void
}

const CATEGORIES = [
  'Italian',
  'Asian',
  'American',
  'Mexican',
  'Mediterranean',
  'Quick Bites',
  'Comfort',
  'Other',
]

export default function MealForm({ meal, onSave, onCancel }: MealFormProps) {
  const isEditing = !!meal
  const existingTags: string[] = meal?.tags
    ? (() => { try { return JSON.parse(meal.tags) } catch { return [] } })()
    : []

  const [name, setName] = useState(meal?.name ?? '')
  const [category, setCategory] = useState(meal?.category ?? '')
  const [description, setDescription] = useState(meal?.description ?? '')
  const [tags, setTags] = useState<string[]>(existingTags)
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addTag = (raw: string) => {
    const t = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Meal name is required')
      return
    }

    setLoading(true)
    try {
      const payload: MealFormData = {
        name: trimmedName,
        category: category || undefined,
        description: description || undefined,
        tags: tags.length > 0 ? tags : undefined,
      }

      const url = isEditing ? `/api/meals/${meal.id}` : '/api/meals'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      onSave(data)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#161638',
        border: '1px solid rgba(245,158,11,0.25)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'rgba(245,158,11,0.15)' }}
      >
        <h3
          className="font-bold text-lg"
          style={{ fontFamily: 'var(--font-playfair)', color: '#fbbf24' }}
        >
          {isEditing ? 'Edit Meal' : 'Add New Meal'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Name <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chicken Tikka Masala"
            className="input-dark"
            autoFocus
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-dark"
            style={{ appearance: 'none' }}
          >
            <option value="">— Select category —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the meal..."
            rows={2}
            className="input-dark resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
            Tags
          </label>
          <div
            className="flex flex-wrap gap-1.5 p-2 min-h-[44px] rounded-xl transition-all duration-200 focus-within:border-amber-500"
            style={{
              background: 'rgba(7,7,26,0.8)',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  color: '#fbbf24',
                }}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder={tags.length === 0 ? 'Type tag + Enter...' : ''}
              className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-gray-300 placeholder-gray-700"
            />
          </div>
          <p className="text-xs text-gray-700 mt-1">Press Enter or comma to add a tag</p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171',
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
            style={{
              background: loading
                ? 'rgba(245,158,11,0.4)'
                : 'linear-gradient(135deg, #d97706, #f59e0b)',
              color: '#07071a',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus size={16} />
                {isEditing ? 'Save Changes' : 'Add Meal'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
