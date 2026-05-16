import sql from '@/lib/db'
import { createTeam, updateTeam, deleteTeam } from './actions'

export const dynamic = 'force-dynamic'

interface TeamRow {
  id: number
  name: string
  player1_name: string
  player2_name: string
  player1_email: string | null
  player2_email: string | null
  player1_claimed: boolean
  player2_claimed: boolean
}

export default async function TeamsAdminPage() {
  const teams = (await sql`
    SELECT
      t.id, t.name, t.player1_name, t.player2_name,
      MAX(CASE WHEN tm.player_index = 1 THEN tm.assigned_email END) AS player1_email,
      MAX(CASE WHEN tm.player_index = 2 THEN tm.assigned_email END) AS player2_email,
      BOOL_OR(tm.player_index = 1 AND tm.user_id IS NOT NULL) AS player1_claimed,
      BOOL_OR(tm.player_index = 2 AND tm.user_id IS NOT NULL) AS player2_claimed
    FROM teams t
    LEFT JOIN team_members tm ON tm.team_id = t.id
    GROUP BY t.id
    ORDER BY t.name ASC
  `) as unknown as TeamRow[]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 24,
            color: 'var(--pdp-ink)',
            marginBottom: 12,
          }}
        >
          Manage <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>teams</span>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {teams.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'var(--pdp-cream-soft)',
                border: '1px solid rgba(27,67,50,0.12)',
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'flex-end',
              }}
            >
              <form
                action={updateTeam}
                style={{
                  flex: 1,
                  minWidth: 320,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 10,
                  alignItems: 'flex-end',
                }}
              >
                <input type="hidden" name="id" value={t.id} />
                <Field label="Team name">
                  <input name="name" defaultValue={t.name} required style={inputStyle} />
                </Field>
                <Field label="Player 1 name">
                  <input
                    name="player1_name"
                    defaultValue={t.player1_name}
                    required
                    style={inputStyle}
                  />
                </Field>
                <Field
                  label={`Player 1 email${t.player1_claimed ? ' · claimed' : t.player1_email ? ' · pending' : ''}`}
                >
                  <input
                    type="email"
                    name="player1_email"
                    defaultValue={t.player1_email ?? ''}
                    placeholder="player@email"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Player 2 name">
                  <input
                    name="player2_name"
                    defaultValue={t.player2_name}
                    required
                    style={inputStyle}
                  />
                </Field>
                <Field
                  label={`Player 2 email${t.player2_claimed ? ' · claimed' : t.player2_email ? ' · pending' : ''}`}
                >
                  <input
                    type="email"
                    name="player2_email"
                    defaultValue={t.player2_email ?? ''}
                    placeholder="player@email"
                    style={inputStyle}
                  />
                </Field>
                <div>
                  <button type="submit" style={btnPrimary}>
                    Save
                  </button>
                </div>
              </form>
              <form action={deleteTeam}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" style={btnDanger}>
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 22,
            color: 'var(--pdp-ink)',
            marginBottom: 12,
          }}
        >
          Add <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>team</span>
        </div>
        <form
          action={createTeam}
          style={{
            background: 'var(--pdp-cream-soft)',
            border: '1px solid rgba(27,67,50,0.12)',
            borderRadius: 14,
            padding: 14,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'flex-end',
          }}
        >
          <Field label="Team name">
            <input name="name" required style={inputStyle} />
          </Field>
          <Field label="Player 1 name">
            <input name="player1_name" required style={inputStyle} />
          </Field>
          <Field label="Player 2 name">
            <input name="player2_name" required style={inputStyle} />
          </Field>
          <button type="submit" style={btnPrimary}>
            Add team
          </button>
        </form>
        <div
          style={{
            marginTop: 8,
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            color: 'var(--pdp-stone)',
            lineHeight: 1.5,
          }}
        >
          Assign player emails after creating the team. A player&apos;s account is{' '}
          <strong>claimed</strong> once they sign in with the assigned email.
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontFamily: 'Manrope, sans-serif',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        color: 'var(--pdp-stone)',
        textTransform: 'uppercase',
      }}
    >
      {label}
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  height: 36,
  padding: '0 10px',
  borderRadius: 8,
  border: '1px solid rgba(27,67,50,0.18)',
  background: '#fff',
  fontFamily: 'Manrope, sans-serif',
  fontSize: 13,
  color: 'var(--pdp-ink)',
  outline: 'none',
  textTransform: 'none',
  letterSpacing: 'normal',
  fontWeight: 500,
}

const btnPrimary: React.CSSProperties = {
  height: 36,
  padding: '0 16px',
  background: 'var(--pdp-fairway)',
  color: 'var(--pdp-cream)',
  border: 'none',
  borderRadius: 10,
  fontFamily: 'Manrope, sans-serif',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}

const btnDanger: React.CSSProperties = {
  height: 36,
  padding: '0 12px',
  background: 'rgba(179,54,54,0.08)',
  color: 'var(--pdp-clay)',
  border: '1px solid rgba(179,54,54,0.2)',
  borderRadius: 10,
  fontFamily: 'Manrope, sans-serif',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
}
