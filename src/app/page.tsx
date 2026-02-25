'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Dices, ChefHat, Loader2 } from 'lucide-react'
import type { Meal, SelectionHistory, EligibilityResult, AppSettings, NoEligibleMealsResponse } from '@/types'
import SpinWheel, { SpinWheelRef } from '@/components/SpinWheel'
import MealReveal from '@/components/MealReveal'
import HistoryPanel from '@/components/HistoryPanel'
import EligibilityStatus from '@/components/EligibilityStatus'
import NoEligibleMealsPanel from '@/components/NoEligibleMealsPanel'

const SPIN_DURATION_MS = 3200

export default function HomePage() {
  const wheelRef = useRef<SpinWheelRef>(null)
  const wheelContainerRef = useRef<HTMLDivElement>(null)
  const [wheelSize, setWheelSize] = useState(300)

  const [spinning, setSpinning] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null)
  const [sessionRejectedIds, setSessionRejectedIds] = useState<string[]>([])
  const [history, setHistory] = useState<SelectionHistory[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [noEligibleMeals, setNoEligibleMeals] = useState<NoEligibleMealsResponse | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [cooldownOverride, setCooldownOverride] = useState<number | null>(null)

  const effectiveCooldown = cooldownOverride ?? settings?.cooldownDays ?? 21

  // Responsive wheel sizing via ResizeObserver
  useEffect(() => {
    const el = wheelContainerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      const h = entry.contentRect.height
      // Bound the wheel by both width and height so it doesn't smash into the button
      setWheelSize(Math.min(Math.floor(w), Math.floor(h), 400))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/selections?days=all')
      const data = await res.json()
      setHistory(Array.isArray(data) ? data : [])
    } catch {
      console.error('Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data)
    } catch {
      console.error('Failed to load settings')
    }
  }, [])

  const checkEligibility = useCallback(async (cooldownDays: number, rejectedIds: string[]) => {
    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionRejectedIds: rejectedIds, cooldownDays }),
      })
      const data = await res.json()
      if (data.noEligibleMeals) {
        setNoEligibleMeals(data)
        setEligibilityResult(data.eligibilityResult)
      } else {
        setNoEligibleMeals(null)
        setEligibilityResult(data.eligibilityResult)
      }
    } catch {
      console.error('Failed to check eligibility')
    }
  }, [])

  useEffect(() => {
    Promise.all([loadSettings(), loadHistory()]).then(() => setInitialLoading(false))
  }, [loadSettings, loadHistory])

  useEffect(() => {
    if (!initialLoading) checkEligibility(effectiveCooldown, sessionRejectedIds)
  }, [effectiveCooldown, sessionRejectedIds, initialLoading, checkEligibility])

  const handleSpin = async () => {
    if (spinning) return
    setSpinning(true)
    setNoEligibleMeals(null)
    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionRejectedIds, cooldownDays: effectiveCooldown }),
      })
      const data = await res.json()
      if (data.noEligibleMeals) {
        setNoEligibleMeals(data)
        setEligibilityResult(data.eligibilityResult)
        setSpinning(false)
        return
      }
      // Store meal without revealing yet — wait for wheel to finish
      const pendingMeal: Meal = data.selectedMeal
      setEligibilityResult(data.eligibilityResult)
      await wheelRef.current?.spin(SPIN_DURATION_MS)
      await new Promise((r) => setTimeout(r, 300))
      // Reveal after wheel stops
      setSelectedMeal(pendingMeal)
    } catch {
      console.error('Spin failed')
      setSpinning(false)
      return
    }
    setSpinning(false)
  }

  const handleConfirm = async () => {
    if (!selectedMeal) return
    setConfirmLoading(true)
    try {
      await fetch('/api/selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId: selectedMeal.id }),
      })
      setSelectedMeal(null)
      setSessionRejectedIds([])
      setCooldownOverride(null)
      await loadHistory()
      await checkEligibility(effectiveCooldown, [])
    } catch {
      console.error('Confirm failed')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleReject = () => {
    if (!selectedMeal) return
    setSessionRejectedIds((prev) => [...prev, selectedMeal.id])
    setSelectedMeal(null)
  }

  const handleCooldownChange = async (days: number) => {
    setCooldownOverride(days)
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cooldownDays: days }),
      })
      setSettings((prev) => (prev ? { ...prev, cooldownDays: days } : prev))
      setCooldownOverride(null)
    } catch { /* keep override */ }
  }

  const handleReduceCooldown = (days: number) => {
    setCooldownOverride(days)
    setNoEligibleMeals(null)
  }

  const handleResetSession = () => {
    setSessionRejectedIds([])
    setNoEligibleMeals(null)
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80dvh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-gold-dark animate-spin" />
          <p className="text-sm tracking-widest uppercase text-white/40 font-display text-glow">Initializing system...</p>
        </div>
      </div>
    )
  }

  const isEligible = eligibilityResult && eligibilityResult.eligibleMeals.length > 0

  return (
    <>
      <MealReveal
        meal={selectedMeal}
        onConfirm={handleConfirm}
        onReject={handleReject}
        loading={confirmLoading}
      />

      <div
        className="flex-1 w-full max-w-lg mx-auto self-center px-4 pb-8 flex flex-col"
        style={{ paddingTop: '1.5rem', minHeight: '100dvh' }}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <p
            className="text-sm font-semibold tracking-[0.3em] font-display uppercase mb-2"
            style={{ color: 'rgba(251,133,0,0.6)' }}
          >
            System Active
          </p>
          <h1
            className="font-black leading-tight font-display tracking-tight text-gradient-gold drop-shadow-lg"
            style={{ fontSize: 'clamp(2.75rem, 11vw, 4.5rem)' }}
          >
            Spin to Decide
          </h1>
        </div>

        {noEligibleMeals ? (
          <NoEligibleMealsPanel
            response={noEligibleMeals}
            currentCooldownDays={effectiveCooldown}
            onReduceCooldown={handleReduceCooldown}
            onResetSession={handleResetSession}
            sessionRejectedCount={sessionRejectedIds.length}
          />
        ) : (
          <>
            <div className="mb-6">
              <EligibilityStatus
                eligibilityResult={eligibilityResult}
                sessionRejectedCount={sessionRejectedIds.length}
                cooldownDays={effectiveCooldown}
                onCooldownChange={handleCooldownChange}
              />
            </div>

            {/* Wheel — perfectly centered by flex-1 parent, with forced height constraint */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] my-8 w-full">
              <div ref={wheelContainerRef} className="w-full h-full flex items-center justify-center">
                {wheelSize > 0 && (
                  <SpinWheel
                    ref={wheelRef}
                    spinning={spinning}
                    size={wheelSize}
                  />
                )}
              </div>
            </div>

            {/* Spin button */}
            <div className="flex flex-col items-center gap-6 mt-12 mb-4">

              {/* Spin button */}
              <div className="relative flex items-center justify-center px-4">
                <button
                  onClick={handleSpin}
                  disabled={spinning || !isEligible}
                  className="btn-spin w-full max-w-[280px]"
                >
                  <Dices
                    size={20}
                    style={{ animation: spinning ? 'spin-idle 0.5s linear infinite' : 'none' }}
                  />
                  {spinning ? 'Spinning…' : 'Spin the Wheel'}
                </button>
              </div>

              {sessionRejectedIds.length > 0 && (
                <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {sessionRejectedIds.length} skipped this session
                  {' · '}
                  <button
                    onClick={handleResetSession}
                    className="underline hover:text-gold transition-colors"
                    style={{ color: 'rgba(251,133,0,0.6)' }}
                  >
                    reset
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        {/* Manage meals link */}
        <div className="flex justify-center mt-8 mb-6">
          <Link
            href="/meals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wide uppercase font-display font-medium transition-all duration-300 hover:bg-white/10"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <ChefHat size={16} />
            Manage meals
          </Link>
        </div>

        {/* History */}
        <HistoryPanel
          history={history}
          onRefresh={loadHistory}
          loading={historyLoading}
        />
      </div>
    </>
  )
}
