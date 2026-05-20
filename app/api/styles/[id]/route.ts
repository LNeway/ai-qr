import { NextResponse } from 'next/server'
import { loadStyle } from '@/lib/styles'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const style = await loadStyle(id)
    return NextResponse.json(style)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Not found'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}