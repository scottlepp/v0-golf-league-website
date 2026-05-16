import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ weekId: string; teamId: string }> },
) {
  try {
    const { weekId, teamId } = await params
    const week_id = parseInt(weekId, 10)
    const team_id = parseInt(teamId, 10)
    if (isNaN(week_id) || isNaN(team_id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const submissionRows = (await sql`
      SELECT id, player1_score, player2_score, total_score
      FROM score_submissions
      WHERE week_id = ${week_id} AND team_id = ${team_id}
    `) as unknown as Array<{
      id: number
      player1_score: number
      player2_score: number
      total_score: number
    }>

    if (submissionRows.length === 0) {
      return NextResponse.json({ submission: null, holes: [] })
    }

    const submission = submissionRows[0]
    let holes: Array<{ hole_number: number; player_index: number; strokes: number }> = []
    try {
      holes = (await sql`
        SELECT hole_number, player_index, strokes
        FROM score_holes
        WHERE submission_id = ${submission.id}
        ORDER BY hole_number ASC, player_index ASC
      `) as unknown as typeof holes
    } catch {
      holes = []
    }

    return NextResponse.json({ submission, holes })
  } catch (error) {
    console.error('Error fetching score holes:', error)
    return NextResponse.json({ error: 'Failed to fetch score holes' }, { status: 500 })
  }
}
