import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meal = await prisma.meal.findFirst({
      where: { id: params.id, deletedAt: null },
    })

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    return NextResponse.json(meal)
  } catch (error) {
    console.error('[GET /api/meals/:id]', error)
    return NextResponse.json({ error: 'Failed to fetch meal' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meal = await prisma.meal.findFirst({
      where: { id: params.id, deletedAt: null },
    })

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, category, description, tags, enabled } = body

    // If updating name, check for duplicate (excluding self)
    if (name !== undefined && name !== meal.name) {
      const trimmedName = name.trim()
      if (!trimmedName) {
        return NextResponse.json({ error: 'Meal name cannot be empty' }, { status: 400 })
      }

      // SQLite doesn't support mode:'insensitive' — do case check in JS
      const allActive = await prisma.meal.findMany({ where: { deletedAt: null }, select: { id: true, name: true } })
      const duplicate = allActive.find(
        (m) => m.id !== params.id && m.name.toLowerCase() === trimmedName.toLowerCase()
      )

      if (duplicate) {
        return NextResponse.json(
          { error: `A meal named "${duplicate.name}" already exists` },
          { status: 409 }
        )
      }
    }

    const updated = await prisma.meal.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(category !== undefined ? { category: category?.trim() || null } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(tags !== undefined
          ? { tags: Array.isArray(tags) && tags.length > 0 ? JSON.stringify(tags) : null }
          : {}),
        ...(enabled !== undefined ? { enabled: Boolean(enabled) } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PATCH /api/meals/:id]', error)
    return NextResponse.json({ error: 'Failed to update meal' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const meal = await prisma.meal.findFirst({
      where: { id: params.id, deletedAt: null },
    })

    if (!meal) {
      return NextResponse.json({ error: 'Meal not found' }, { status: 404 })
    }

    // Soft delete
    const updated = await prisma.meal.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[DELETE /api/meals/:id]', error)
    return NextResponse.json({ error: 'Failed to delete meal' }, { status: 500 })
  }
}
