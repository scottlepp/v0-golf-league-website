'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'

function str(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v.trim() : ''
}

export async function createTeam(formData: FormData) {
  await requireAdmin()
  const name = str(formData.get('name'))
  const p1 = str(formData.get('player1_name'))
  const p2 = str(formData.get('player2_name'))
  if (!name || !p1 || !p2) return

  await sql`INSERT INTO teams (name, player1_name, player2_name) VALUES (${name}, ${p1}, ${p2})`
  revalidatePath('/admin/teams')
  revalidatePath('/')
}

export async function updateTeam(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const name = str(formData.get('name'))
  const p1 = str(formData.get('player1_name'))
  const p2 = str(formData.get('player2_name'))
  if (!Number.isInteger(id) || !name || !p1 || !p2) return

  await sql`UPDATE teams SET name = ${name}, player1_name = ${p1}, player2_name = ${p2} WHERE id = ${id}`
  revalidatePath('/admin/teams')
  revalidatePath('/')
}

export async function deleteTeam(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return

  await sql`DELETE FROM teams WHERE id = ${id}`
  revalidatePath('/admin/teams')
  revalidatePath('/')
}
