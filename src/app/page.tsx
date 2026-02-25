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
      // Container is fixed 360px tall; subtract 30px for pointer clearance
      setWheelSize(Math.min(Math.floor(w), Math.floor(h) - 30, 380))
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
        style={{
          width: '100%',
          maxWidth: '512px',
          margin: '0 auto',
          padding: '0 16px',
          paddingTop: 'max(2rem, env(safe-area-inset-top))',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1
            className="font-black font-display tracking-tight"
            style={{ fontSize: 'clamp(2rem, 9vw, 3.5rem)', textAlign: 'center', lineHeight: 1.1 }}
          >
            <span className="text-gradient-gold">Spin to Decide</span>
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
            <div style={{ marginBottom: '1.5rem' }}>
              <EligibilityStatus
                eligibilityResult={eligibilityResult}
                sessionRejectedCount={sessionRejectedIds.length}
                cooldownDays={effectiveCooldown}
                onCooldownChange={handleCooldownChange}
              />
            </div>

            {/* Wheel — fixed height so it never grows into the button */}
            <div
              ref={wheelContainerRef}
              style={{
                width: '100%',
                height: '360px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {wheelSize > 0 && (
                <SpinWheel
                  ref={wheelRef}
                  spinning={spinning}
                  size={wheelSize}
                />
              )}
            </div>

            {/* Spin button — 56px top gap keeps it clear of wheel glow */}
            <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleSpin}
                disabled={spinning || !isEligible}
                className="btn-spin"
                style={{ width: '100%', maxWidth: '320px' }}
              >
                <Dices
                  size={20}
                  style={{ animation: spinning ? 'spin-idle 0.5s linear infinite' : 'none' }}
                />
                {spinning ? 'Spinning…' : 'Spin the Wheel'}
              </button>

              {sessionRejectedIds.length > 0 && (
                <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  {sessionRejectedIds.length} skipped this session
                  {' · '}
                  <button
                    onClick={handleResetSession}
                    style={{ color: 'rgba(251,133,0,0.6)', textDecoration: 'underline' }}
                  >
                    reset
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        {/* Manage meals link — large touch target */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', marginBottom: '1.5rem' }}>
          <Link
            href="/meals"
            className="font-display font-medium transition-all duration-300"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <ChefHat size={17} />
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
