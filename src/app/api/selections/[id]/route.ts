import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const selection = await prisma.selectionHistory.findUnique({
      where: { id: params.id },
    })

    if (!selection) {
      return NextResponse.json({ error: 'Selection not found' }, { status: 404 })
    }

    await prisma.selectionHistory.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/selections/:id]', error)
    return NextResponse.json({ error: 'Failed to delete selection' }, { status: 500 })
  }
}
