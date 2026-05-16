import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { scoreSubmissionSchema } from '@/lib/validations'

async function calculateStandings(week_id: number) {
  const scores = (await sql`
    SELECT team_id, total_score FROM score_submissions
    WHERE week_id = ${week_id}
    ORDER BY total_score ASC
  `) as unknown as Array<{ team_id: number; total_score: number }>

  if (scores.length === 0) return

  await sql`DELETE FROM weekly_standings WHERE week_id = ${week_id}`

  for (let i = 0; i < scores.length; i++) {
    const rank = i + 1
    const points = scores.length - i
    await sql`
      INSERT INTO weekly_standings (week_id, team_id, total_score, rank, points_earned)
      VALUES (${week_id}, ${scores[i].team_id}, ${scores[i].total_score}, ${rank}, ${points})
    `
  }
}

async function replaceHoleScores(
  submission_id: number,
  player1_holes: number[] | undefined,
  player2_holes: number[] | undefined,
) {
  await sql`DELETE FROM score_holes WHERE submission_id = ${submission_id}`
  if (player1_holes) {
    for (let i = 0; i < player1_holes.length; i++) {
      await sql`
        INSERT INTO score_holes (submission_id, hole_number, player_index, strokes)
        VALUES (${submission_id}, ${i + 1}, 1, ${player1_holes[i]})
      `
    }
  }
  if (player2_holes) {
    for (let i = 0; i < player2_holes.length; i++) {
      await sql`
        INSERT INTO score_holes (submission_id, hole_number, player_index, strokes)
        VALUES (${submission_id}, ${i + 1}, 2, ${player2_holes[i]})
      `
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = scoreSubmissionSchema.parse(body)
    const { week_id, team_id, player1_score, player2_score, player1_holes, player2_holes } = validated

    const total_score = player1_score + player2_score

    const teamCheck = await sql`SELECT id FROM teams WHERE id = ${team_id}`
    if (teamCheck.length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }
    const weekCheck = await sql`SELECT id FROM weeks WHERE id = ${week_id}`
    if (weekCheck.length === 0) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 })
    }

    const existing = (await sql`
      SELECT id FROM score_submissions
      WHERE week_id = ${week_id} AND team_id = ${team_id}
    `) as unknown as Array<{ id: number }>

    let submission_id: number
    if (existing.length > 0) {
      submission_id = existing[0].id
      await sql`
        UPDATE score_submissions
        SET player1_score = ${player1_score},
            player2_score = ${player2_score},
            total_score = ${total_score},
            submitted_at = NOW()
        WHERE id = ${submission_id}
      `
    } else {
      const inserted = (await sql`
        INSERT INTO score_submissions (week_id, team_id, player1_score, player2_score, total_score)
        VALUES (${week_id}, ${team_id}, ${player1_score}, ${player2_score}, ${total_score})
        RETURNING id
      `) as unknown as Array<{ id: number }>
      submission_id = inserted[0].id
    }

    if (player1_holes || player2_holes) {
      try {
        await replaceHoleScores(submission_id, player1_holes, player2_holes)
      } catch (err) {
        // score_holes table may not exist yet — degrade gracefully
        console.warn('Per-hole save failed (table missing?):', err)
      }
    }

    await calculateStandings(week_id)

    return NextResponse.json({ message: 'Scores submitted successfully' }, { status: 200 })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const details = (error as unknown as { errors?: unknown }).errors
      return NextResponse.json({ error: 'Invalid input data', details }, { status: 400 })
    }
    console.error('Error submitting scores:', error)
    return NextResponse.json({ error: 'Failed to submit scores' }, { status: 500 })
  }
}
