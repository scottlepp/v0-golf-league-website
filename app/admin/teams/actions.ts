'use server'

import sql from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'

function str(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v.trim() : ''
}

function emailOrNull(v: FormDataEntryValue | null): string | null {
  const s = str(v).toLowerCase()
  if (!s) return null
  // very loose check — admins are trusted, this is just a guard against typos
  if (!s.includes('@')) return null
  return s
}

async function ensureTeamMemberRows(team_id: number) {
  await sql`
    INSERT INTO team_members (team_id, player_index)
    SELECT ${team_id}, p.idx FROM (VALUES (1), (2)) AS p(idx)
    ON CONFLICT (team_id, player_index) DO NOTHING
  `
}

async function setAssignedEmail(team_id: number, player_index: 1 | 2, email: string | null) {
  await ensureTeamMemberRows(team_id)
  if (email === null) {
    // clearing assignment also detaches any user_id
    await sql`
      UPDATE team_members
      SET assigned_email = NULL, user_id = NULL
      WHERE team_id = ${team_id} AND player_index = ${player_index}
    `
  } else {
    // detach any existing user_id whose email no longer matches; keep user_id if
    // it matches the new email (so admin can correct a typo without un-claiming)
    await sql`
      UPDATE team_members
      SET assigned_email = ${email},
          user_id = (
            CASE WHEN user_id IS NOT NULL
              AND (SELECT LOWER(p.email) FROM profiles p WHERE p.user_id = team_members.user_id) = ${email}
              THEN user_id
              ELSE NULL
            END
          )
      WHERE team_id = ${team_id} AND player_index = ${player_index}
    `
    // claim immediately if a profile with this email exists
    await sql`
      UPDATE team_members
      SET user_id = p.user_id
      FROM profiles p
      WHERE team_members.team_id = ${team_id}
        AND team_members.player_index = ${player_index}
        AND LOWER(p.email) = ${email}
        AND team_members.user_id IS NULL
    `
  }
}

export async function createTeam(formData: FormData) {
  await requireAdmin()
  const name = str(formData.get('name'))
  const p1 = str(formData.get('player1_name'))
  const p2 = str(formData.get('player2_name'))
  if (!name || !p1 || !p2) return

  const result = (await sql`
    INSERT INTO teams (name, player1_name, player2_name)
    VALUES (${name}, ${p1}, ${p2})
    RETURNING id
  `) as unknown as Array<{ id: number }>
  if (result[0]) await ensureTeamMemberRows(result[0].id)

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

  await setAssignedEmail(id, 1, emailOrNull(formData.get('player1_email')))
  await setAssignedEmail(id, 2, emailOrNull(formData.get('player2_email')))

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
