import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.appSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', cooldownDays: 21 },
      update: {},
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('[GET /api/settings]', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { cooldownDays } = body

    if (cooldownDays === undefined) {
      return NextResponse.json({ error: 'cooldownDays is required' }, { status: 400 })
    }

    const days = parseInt(String(cooldownDays), 10)
    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'cooldownDays must be between 1 and 365' },
        { status: 400 }
      )
    }

    const settings = await prisma.appSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', cooldownDays: days },
      update: { cooldownDays: days },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('[PATCH /api/settings]', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
