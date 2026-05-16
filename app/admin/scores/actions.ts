'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'

async function recalcStandings(week_id: number) {
  const scores = (await sql`
    SELECT team_id, total_score FROM score_submissions
    WHERE week_id = ${week_id}
    ORDER BY total_score ASC
  `) as unknown as Array<{ team_id: number; total_score: number }>

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

export async function updateScore(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const week_id = Number(formData.get('week_id'))
  const p1 = Number(formData.get('player1_score'))
  const p2 = Number(formData.get('player2_score'))
  if (![id, week_id, p1, p2].every(Number.isFinite)) return

  const total = p1 + p2
  await sql`
    UPDATE score_submissions
    SET player1_score = ${p1}, player2_score = ${p2}, total_score = ${total}, submitted_at = NOW()
    WHERE id = ${id}
  `
  await recalcStandings(week_id)
  revalidatePath('/admin/scores')
  revalidatePath('/')
}

export async function deleteScore(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const week_id = Number(formData.get('week_id'))
  if (!Number.isInteger(id) || !Number.isInteger(week_id)) return

  await sql`DELETE FROM score_submissions WHERE id = ${id}`
  await recalcStandings(week_id)
  revalidatePath('/admin/scores')
  revalidatePath('/')
}
