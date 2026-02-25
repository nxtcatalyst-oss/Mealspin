import type { Meal, SelectionHistory, EligibilityResult, BlockedMeal } from '@/types'

export const DEFAULT_COOLDOWN_DAYS = 21

/**
 * Core eligibility algorithm.
 * Determines which meals are eligible for selection based on:
 * - Meal must be enabled and not soft-deleted
 * - Meal must not have a confirmed selection within cooldownDays
 * - Meal must not be in the current session's rejected list
 */
export function getEligibilityResult(
  allMeals: Meal[],
  history: SelectionHistory[],
  cooldownDays: number = DEFAULT_COOLDOWN_DAYS,
  sessionRejectedIds: string[] = []
): EligibilityResult {
  const now = new Date()
  const cutoff = new Date(now.getTime() - cooldownDays * 24 * 60 * 60 * 1000)

  // Only consider enabled, non-deleted meals
  const activeMeals = allMeals.filter((m) => m.enabled && !m.deletedAt)

  // Build a map of the most recent confirmed selection per meal
  const lastSelectedMap = new Map<string, Date>()
  for (const sel of history) {
    if (!sel.confirmed) continue
    const selDate = new Date(sel.selectedAt)
    const existing = lastSelectedMap.get(sel.mealId)
    if (!existing || selDate > existing) {
      lastSelectedMap.set(sel.mealId, selDate)
    }
  }

  const eligibleMeals: Meal[] = []
  const blockedMeals: BlockedMeal[] = []
  const sessionRejectedMeals: Meal[] = []

  for (const meal of activeMeals) {
    // Session-rejected meals are excluded from this spin cycle only
    if (sessionRejectedIds.includes(meal.id)) {
      sessionRejectedMeals.push(meal)
      continue
    }

    const lastSelected = lastSelectedMap.get(meal.id)
    if (lastSelected && lastSelected > cutoff) {
      const unblocksAt = new Date(lastSelected.getTime() + cooldownDays * 24 * 60 * 60 * 1000)
      const daysUntilUnblocked = Math.ceil(
        (unblocksAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
      )
      blockedMeals.push({
        meal,
        lastSelectedAt: lastSelected.toISOString(),
        unblocksAt: unblocksAt.toISOString(),
        daysUntilUnblocked,
      })
    } else {
      eligibleMeals.push(meal)
    }
  }

  return {
    eligibleMeals,
    blockedMeals,
    sessionRejectedMeals,
    totalEnabled: activeMeals.length,
  }
}

/**
 * Picks a random meal from the eligible pool.
 * Returns null if pool is empty.
 */
export function pickRandomMeal(eligibleMeals: Meal[]): Meal | null {
  if (eligibleMeals.length === 0) return null
  const idx = Math.floor(Math.random() * eligibleMeals.length)
  return eligibleMeals[idx]
}
