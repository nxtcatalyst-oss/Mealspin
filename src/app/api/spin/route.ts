import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEligibilityResult, pickRandomMeal } from '@/lib/selectionService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const sessionRejectedIds: string[] = body.sessionRejectedIds ?? []
    const cooldownOverride: number | undefined = body.cooldownDays

    // Fetch all non-deleted meals
    const allMeals = await prisma.meal.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    })

    // Fetch all confirmed selection history
    const history = await prisma.selectionHistory.findMany({
      where: { confirmed: true },
    })

    // Fetch cooldown settings
    const settings = await prisma.appSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', cooldownDays: 21 },
      update: {},
    })

    const cooldownDays = cooldownOverride ?? settings.cooldownDays

    // Serialize Prisma results to plain objects with string dates
    const serializedMeals = allMeals.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      deletedAt: m.deletedAt?.toISOString() ?? null,
    }))

    const serializedHistory = history.map((h) => ({
      ...h,
      selectedAt: h.selectedAt.toISOString(),
    }))

    // Run eligibility algorithm
    const eligibilityResult = getEligibilityResult(
      serializedMeals,
      serializedHistory,
      cooldownDays,
      sessionRejectedIds
    )

    // Pick a random eligible meal
    const selectedMeal = pickRandomMeal(eligibilityResult.eligibleMeals)

    if (!selectedMeal) {
      const suggestions: string[] = []
      if (cooldownDays > 14) suggestions.push('Reduce cooldown to 14 days')
      if (cooldownDays > 7) suggestions.push('Reduce cooldown to 7 days')
      if (sessionRejectedIds.length > 0) suggestions.push('Reset session rejections')
      suggestions.push('Add more meals')

      return NextResponse.json({
        noEligibleMeals: true,
        reason:
          eligibilityResult.totalEnabled === 0
            ? 'No meals are enabled. Add or enable meals first.'
            : eligibilityResult.sessionRejectedMeals.length === eligibilityResult.totalEnabled
            ? 'All meals have been rejected this session.'
            : `All ${eligibilityResult.blockedMeals.length} eligible meals are on cooldown (${cooldownDays} days).`,
        eligibilityResult,
        suggestions,
      })
    }

    return NextResponse.json({ selectedMeal, eligibilityResult })
  } catch (error) {
    console.error('[POST /api/spin]', error)
    return NextResponse.json({ error: 'Spin failed' }, { status: 500 })
  }
}
