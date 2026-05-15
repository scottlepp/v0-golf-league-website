import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const { weekId } = await params
    const week_id = parseInt(weekId, 10)

    if (isNaN(week_id)) {
      return NextResponse.json({ error: 'Invalid week ID' }, { status: 400 })
    }

    const standings = await sql`
      SELECT 
        ws.id,
        ws.week_id,
        ws.team_id,
        ws.total_score,
        ws.rank,
        ws.points_earned,
        t.name as team_name,
        t.player1_name,
        t.player2_name
      FROM weekly_standings ws
      JOIN teams t ON ws.team_id = t.id
      WHERE ws.week_id = ${week_id}
      ORDER BY ws.rank ASC
    `

    return NextResponse.json(standings)
  } catch (error) {
    console.error('Error fetching standings:', error)
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 })
  }
}
