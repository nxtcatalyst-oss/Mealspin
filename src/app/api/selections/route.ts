import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days')
    const limit = parseInt(searchParams.get('limit') ?? '100', 10)

    let dateFilter: Date | undefined
    if (days && days !== 'all') {
      const numDays = parseInt(days, 10)
      if (!isNaN(numDays)) {
        dateFilter = new Date(Date.now() - numDays * 24 * 60 * 60 * 1000)
      }
    }

    const selections = await prisma.selectionHistory.findMany({
      where: {
        confirmed: true,
        ...(dateFilter ? { selectedAt: { gte: dateFilter } } : {}),
      },
      include: { meal: true },
      orderBy: { selectedAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(selections)
  } catch (error) {
    console.error('[GET /api/selections]', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mealId, notes } = body

    if (!mealId) {
      return NextResponse.json({ error: 'mealId is required' }, { status: 400 })
    }

    // Verify meal exists
    const meal = await prisma.meal.findFirst({
      where: { id: mealId, deletedAt: null },
    })

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    const selection = await prisma.selectionHistory.create({
      data: {
        mealId,
        confirmed: true,
        notes: notes?.trim() || null,
      },
      include: { meal: true },
    })

    return NextResponse.json(selection, { status: 201 })
  } catch (error) {
    console.error('[POST /api/selections]', error)
    return NextResponse.json({ error: 'Failed to confirm selection' }, { status: 500 })
  }
}
