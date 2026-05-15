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

    const schedule = await sql`
      SELECT 
        s.id,
        s.week_id,
        s.team1_id,
        s.team2_id,
        s.tee_time,
        t1.name as team1_name,
        t2.name as team2_name,
        t1.player1_name as team1_player1,
        t1.player2_name as team1_player2,
        t2.player1_name as team2_player1,
        t2.player2_name as team2_player2
      FROM schedule s
      JOIN teams t1 ON s.team1_id = t1.id
      JOIN teams t2 ON s.team2_id = t2.id
      WHERE s.week_id = ${week_id}
      ORDER BY s.tee_time ASC
    `

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}
