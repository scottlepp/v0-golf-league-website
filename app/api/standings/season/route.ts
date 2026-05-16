import { NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        COALESCE(SUM(ws.points_earned), 0)::int AS points,
        COALESCE(ROUND(AVG(ws.total_score))::int, 0) AS avg_score,
        COUNT(ws.id)::int AS weeks_played
      FROM teams t
      LEFT JOIN weekly_standings ws ON ws.team_id = t.id
      GROUP BY t.id, t.name
      ORDER BY points DESC, avg_score ASC, t.name ASC
    `
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching season standings:', error)
    return NextResponse.json({ error: 'Failed to fetch season standings' }, { status: 500 })
  }
}
