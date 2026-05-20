import { NextResponse } from 'next/server'
import { loadStyles } from '@/lib/styles'

export async function GET() {
  try {
    const styles = await loadStyles()
    return NextResponse.json(styles)
  } catch {
    return NextResponse.json({ error: 'Failed to load styles' }, { status: 500 })
  }
}