'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'

export async function updateMatch(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const team1_id = Number(formData.get('team1_id'))
  const team2_id = Number(formData.get('team2_id'))
  const tee_time = String(formData.get('tee_time') ?? '').trim()
  if (!Number.isInteger(id) || !Number.isInteger(team1_id) || !Number.isInteger(team2_id) || !tee_time) {
    return
  }
  if (team1_id === team2_id) return

  await sql`
    UPDATE schedule
    SET team1_id = ${team1_id}, team2_id = ${team2_id}, tee_time = ${tee_time}
    WHERE id = ${id}
  `
  revalidatePath('/admin/schedule')
  revalidatePath('/')
}

export async function deleteMatch(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return

  await sql`DELETE FROM schedule WHERE id = ${id}`
  revalidatePath('/admin/schedule')
  revalidatePath('/')
}

export async function createMatch(formData: FormData) {
  await requireAdmin()
  const week_id = Number(formData.get('week_id'))
  const team1_id = Number(formData.get('team1_id'))
  const team2_id = Number(formData.get('team2_id'))
  const tee_time = String(formData.get('tee_time') ?? '').trim()
  if (!Number.isInteger(week_id) || !Number.isInteger(team1_id) || !Number.isInteger(team2_id) || !tee_time) {
    return
  }
  if (team1_id === team2_id) return

  await sql`
    INSERT INTO schedule (week_id, team1_id, team2_id, tee_time)
    VALUES (${week_id}, ${team1_id}, ${team2_id}, ${tee_time})
  `
  revalidatePath('/admin/schedule')
  revalidatePath('/')
}
