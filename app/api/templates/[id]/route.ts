import { NextResponse } from 'next/server'
import { loadTemplate, resolveTemplate } from '@/lib/styles'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const [template, resolvedParams] = await Promise.all([
      loadTemplate(id),
      resolveTemplate(id),
    ])
    return NextResponse.json({ ...template, resolvedParams })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Not found'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}