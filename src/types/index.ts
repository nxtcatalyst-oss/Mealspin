export interface Meal {
  id: string
  name: string
  category: string | null
  description: string | null
  tags: string | null // JSON array stored as string e.g. '["quick","comfort"]'
  enabled: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface SelectionHistory {
  id: string
  mealId: string
  selectedAt: string
  confirmed: boolean
  selectedBy: string | null
  notes: string | null
  meal?: Meal
}

export interface BlockedMeal {
  meal: Meal
  lastSelectedAt: string
  unblocksAt: string
  daysUntilUnblocked: number
}

export interface EligibilityResult {
  eligibleMeals: Meal[]
  blockedMeals: BlockedMeal[]
  sessionRejectedMeals: Meal[]
  totalEnabled: number
}

export interface SpinRequest {
  sessionRejectedIds?: string[]
  cooldownDays?: number
}

export interface SpinResponse {
  selectedMeal: Meal
  eligibilityResult: EligibilityResult
}

export interface NoEligibleMealsResponse {
  noEligibleMeals: true
  reason: string
  eligibilityResult: EligibilityResult
  suggestions: string[]
}

export interface AppSettings {
  id: string
  cooldownDays: number
  updatedAt: string
}

export interface MealFormData {
  name: string
  category?: string
  description?: string
  tags?: string[]
}
