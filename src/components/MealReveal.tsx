'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, RotateCcw } from 'lucide-react'
import type { Meal } from '@/types'

interface MealRevealProps {
  meal: Meal | null
  onConfirm: () => void
  onReject: () => void
  loading?: boolean
}

function fireConfetti() {
  import('canvas-confetti').then((module) => {
    const confetti = module.default
    confetti({ particleCount: 130, spread: 80, origin: { y: 0.55 }, colors: ['#f59e0b','#fbbf24','#a855f7','#c084fc','#ffffff'] })
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#f59e0b','#ffffff'] })
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#a855f7','#ffffff'] })
    }, 220)
  })
}

export default function MealReveal({ meal, onConfirm, onReject, loading }: MealRevealProps) {
  const tags: string[] = meal?.tags ? (() => { try { return JSON.parse(meal.tags) } catch { return [] } })() : []

  const handleConfirm = () => {
    fireConfetti()
    setTimeout(onConfirm, 280)
  }

  useEffect(() => {
    document.body.style.overflow = meal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [meal])

  return (
    <AnimatePresence>
      {meal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(5,5,15,0.92)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
          {/* Radial spotlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 500px 350px at 50% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)' }}
          />

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative w-full sm:max-w-sm"
            style={{ maxWidth: '100vw' }}
          >
            <div
              style={{
                background: 'linear-gradient(170deg, #1c1a42 0%, #13132e 50%, #0d0d22 100%)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '1.5rem 1.5rem 0 0',
                boxShadow: '0 -20px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,158,11,0.12)',
                overflow: 'hidden',
              }}
            >
              {/* Top handle bar (mobile sheet feel) */}
              <div className="flex justify-center pt-3 pb-1">
                <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
              </div>

              {/* Top accent line */}
              <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #f59e0b, #a855f7, #f59e0b, transparent)', margin: '0 32px' }} />

              <div className="px-7 pb-8 pt-5 text-center">
                {/* Label */}
                <p
                  className="text-xs font-bold tracking-[0.28em] uppercase mb-3"
                  style={{ color: 'rgba(245,158,11,0.6)' }}
                >
                  Tonight&apos;s Meal
                </p>

                {/* Slot icon */}
                <div
                  className="text-4xl mb-4"
                  style={{ animation: 'float-up 2.5s ease-in-out infinite' }}
                >
                  🎰
                </div>

                {/* Meal name */}
                <h2
                  className="font-black mb-3 leading-tight"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {meal.name}
                </h2>

                {/* Category */}
                {meal.category && (
                  <div className="flex justify-center mb-3">
                    <span className="category-badge">{meal.category}</span>
                  </div>
                )}

                {/* Description */}
                {meal.description && (
                  <p className="text-sm leading-relaxed mb-4 px-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {meal.description}
                  </p>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center mb-5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(245,158,11,0.75)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent)', marginBottom: '1.25rem' }} />

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 font-bold rounded-2xl transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)',
                      color: '#05050f',
                      padding: '1rem',
                      fontSize: '1rem',
                      letterSpacing: '0.04em',
                      boxShadow: '0 4px 24px rgba(245,158,11,0.4)',
                      minHeight: 54,
                    }}
                  >
                    <Check size={18} strokeWidth={3} />
                    Confirm — Let&apos;s Eat!
                  </button>

                  <button
                    onClick={onReject}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.55)',
                      padding: '0.875rem',
                      minHeight: 50,
                    }}
                  >
                    <RotateCcw size={15} />
                    Reject &amp; Re-spin
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
