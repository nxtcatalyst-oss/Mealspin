import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeDisabled = searchParams.get('includeDisabled') === 'true'

    const meals = await prisma.meal.findMany({
      where: {
        deletedAt: null,
        ...(includeDisabled ? {} : { enabled: true }),
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(meals)
  } catch (error) {
    console.error('[GET /api/meals]', error)
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, description, tags } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Meal name is required' }, { status: 400 })
    }

    const trimmedName = name.trim()

    // Check for case-insensitive duplicate (SQLite doesn't support mode:'insensitive')
    const allActive = await prisma.meal.findMany({ where: { deletedAt: null }, select: { id: true, name: true } })
    const existing = allActive.find((m) => m.name.toLowerCase() === trimmedName.toLowerCase())

    if (existing) {
      return NextResponse.json(
        { error: `A meal named "${existing.name}" already exists` },
        { status: 409 }
      )
    }

    const meal = await prisma.meal.create({
      data: {
        name: trimmedName,
        category: category?.trim() || null,
        description: description?.trim() || null,
        tags: Array.isArray(tags) && tags.length > 0 ? JSON.stringify(tags) : null,
      },
    })

    return NextResponse.json(meal, { status: 201 })
  } catch (error) {
    console.error('[POST /api/meals]', error)
    return NextResponse.json({ error: 'Failed to create meal' }, { status: 500 })
  }
}
