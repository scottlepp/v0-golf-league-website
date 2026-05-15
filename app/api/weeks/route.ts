import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    const weeks = await sql`SELECT * FROM weeks ORDER BY week_number ASC`
    return NextResponse.json(weeks)
  } catch (error) {
    console.error('Error fetching weeks:', error)
    return NextResponse.json({ error: 'Failed to fetch weeks' }, { status: 500 })
  }
}
