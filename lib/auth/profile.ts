import sql from '@/lib/db'
import { auth } from './server'

export interface MyTeamInfo {
  team_id: number
  team_name: string
  player_index: 1 | 2
  player1_name: string
  player2_name: string
}

export interface MyProfile {
  user_id: string
  email: string
  display_name: string | null
  team: MyTeamInfo | null
}

/**
 * Looks up (and lazily creates) a profile for the current session.
 * Also claims any team_members row that was pre-assigned to this email.
 * Returns null if there's no session.
 */
export async function getMyProfile(): Promise<MyProfile | null> {
  const { data: session } = await auth.getSession()
  if (!session?.user) return null

  const user = session.user as { id?: string; email?: string; name?: string }
  const userId = user.id
  const email = user.email?.toLowerCase().trim()
  if (!userId || !email) return null

  try {
    await sql`
      INSERT INTO profiles (user_id, email, display_name)
      VALUES (${userId}, ${email}, ${user.name ?? null})
      ON CONFLICT (user_id) DO UPDATE
      SET email = EXCLUDED.email,
          display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
          updated_at = NOW()
    `

    // Claim any team_members row pre-assigned to this email (case-insensitive),
    // but only if not already claimed by some other user.
    await sql`
      UPDATE team_members
      SET user_id = ${userId}
      WHERE LOWER(assigned_email) = ${email}
        AND (user_id IS NULL OR user_id = ${userId})
    `

    const teamRows = (await sql`
      SELECT
        tm.team_id,
        tm.player_index,
        t.name AS team_name,
        t.player1_name,
        t.player2_name
      FROM team_members tm
      JOIN teams t ON t.id = tm.team_id
      WHERE tm.user_id = ${userId}
      LIMIT 1
    `) as unknown as Array<{
      team_id: number
      player_index: 1 | 2
      team_name: string
      player1_name: string
      player2_name: string
    }>

    return {
      user_id: userId,
      email,
      display_name: user.name ?? null,
      team: teamRows[0] ?? null,
    }
  } catch (err) {
    console.error('getMyProfile failed:', err)
    return {
      user_id: userId,
      email,
      display_name: user.name ?? null,
      team: null,
    }
  }
}
