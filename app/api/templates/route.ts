import { NextResponse } from 'next/server'
import { loadTemplates } from '@/lib/styles'

export async function GET() {
  try {
    const templates = await loadTemplates()
    return NextResponse.json(templates)
  } catch {
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 })
  }
}