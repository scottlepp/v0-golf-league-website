import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { scoreSubmissionSchema } from '@/lib/validations'

async function calculateStandings(week_id: number) {
  try {
    // Get all scores for the week
    const scores = await sql`
      SELECT team_id, total_score FROM score_submissions 
      WHERE week_id = ${week_id}
      ORDER BY total_score ASC
    `

    if (scores.length === 0) {
      return
    }

    // Clear existing standings for this week
    await sql`DELETE FROM weekly_standings WHERE week_id = ${week_id}`

    // Calculate rankings and points (1 point for each team, lower score = better rank)
    for (let i = 0; i < scores.length; i++) {
      const rank = i + 1
      const points = scores.length - i // Winner gets most points
      
      await sql`
        INSERT INTO weekly_standings (week_id, team_id, total_score, rank, points_earned)
        VALUES (${week_id}, ${scores[i].team_id}, ${scores[i].total_score}, ${rank}, ${points})
      `
    }
  } catch (error) {
    console.error('Error calculating standings:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = scoreSubmissionSchema.parse(body)
    const { week_id, team_id, player1_score, player2_score } = validatedData

    const total_score = player1_score + player2_score

    // Check if team exists
    const teamCheck = await sql`SELECT id FROM teams WHERE id = ${team_id}`
    if (teamCheck.length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Check if week exists
    const weekCheck = await sql`SELECT id FROM weeks WHERE id = ${week_id}`
    if (weekCheck.length === 0) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 })
    }

    // Insert or update score submission
    const existing = await sql`
      SELECT id FROM score_submissions 
      WHERE week_id = ${week_id} AND team_id = ${team_id}
    `

    if (existing.length > 0) {
      await sql`
        UPDATE score_submissions 
        SET player1_score = ${player1_score}, 
            player2_score = ${player2_score},
            total_score = ${total_score},
            submitted_at = NOW()
        WHERE week_id = ${week_id} AND team_id = ${team_id}
      `
    } else {
      await sql`
        INSERT INTO score_submissions (week_id, team_id, player1_score, player2_score, total_score)
        VALUES (${week_id}, ${team_id}, ${player1_score}, ${player2_score}, ${total_score})
      `
    }

    // Recalculate standings
    await calculateStandings(week_id)

    return NextResponse.json(
      { message: 'Scores submitted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error submitting scores:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to submit scores' }, { status: 500 })
  }
}
