'use client'

import { useEffect, useState } from 'react'
import { TeamMark } from '../team-mark'
import { Bell, Pencil, Cal, Flag, Chevron } from '../icons'
import type { SeasonStanding } from '@/lib/pdp/types'

interface Props {
  email: string
  isAdmin: boolean
  onOpenAdmin: () => void
  onSignOut: () => void
}

interface MyTeam {
  team_id: number
  team_name: string
  player_index: 1 | 2
  player1_name: string
  player2_name: string
}

export function MeScreen({ email, isAdmin, onOpenAdmin, onSignOut }: Props) {
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null)
  const [season, setSeason] = useState<SeasonStanding[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/me').then((r) => (r.ok ? r.json() : { profile: null })),
      fetch('/api/standings/season').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([me, s]) => {
        setMyTeam(me?.profile?.team ?? null)
        setSeason(Array.isArray(s) ? s : [])
      })
      .catch(() => {})
  }, [])

  const myRow = myTeam ? season.find((r) => r.team_id === myTeam.team_id) : null
  const myDisplayName = myTeam
    ? myTeam.player_index === 1
      ? myTeam.player1_name
      : myTeam.player2_name
    : email.split('@')[0]

  return (
    <div style={{ padding: '4px 20px 120px' }}>
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 26,
          color: 'var(--pdp-ink)',
          lineHeight: 1.1,
          marginBottom: 16,
        }}
      >
        My <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>locker</span>
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #1B4332 0%, #2C7A4B 100%)',
          borderRadius: 20,
          padding: 18,
          color: 'var(--pdp-cream)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.08 }}
        >
          <defs>
            <pattern id="me-hatch" patternUnits="userSpaceOnUse" width="6" height="6">
              <path d="M0 6L6 0" stroke="#F4EFE3" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#me-hatch)" />
        </svg>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          {myTeam ? (
            <TeamMark teamId={myTeam.team_id} name={myTeam.team_name} size={56} />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 56,
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Instrument Serif", serif',
                fontSize: 28,
                color: 'rgba(244,239,227,0.7)',
              }}
            >
              ?
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                opacity: 0.65,
              }}
            >
              {myTeam
                ? `Player ${myTeam.player_index} · ${myTeam.team_name}`
                : 'Unassigned'}
              {isAdmin && ' · Commissioner'}
            </div>
            <div
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontSize: 22,
                marginTop: 2,
              }}
            >
              {myDisplayName}
            </div>
            <div
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 12,
                opacity: 0.85,
                marginTop: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {email}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            marginTop: 18,
            padding: '12px 0 2px',
            borderTop: '1px solid rgba(244,239,227,0.18)',
          }}
        >
          <Stat label="Season rank" value={myRow ? `#${seasonRank(season, myRow.team_id)}` : '—'} />
          <Stat label="Points" value={myRow?.points ?? '—'} />
          <Stat label="Avg score" value={myRow?.avg_score ?? '—'} />
        </div>
      </div>

      {!myTeam && (
        <div
          style={{
            marginTop: 12,
            padding: '12px 14px',
            background: 'rgba(201,146,74,0.10)',
            border: '1px solid rgba(201,146,74,0.25)',
            borderRadius: 14,
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12.5,
            color: '#7a4f1c',
            lineHeight: 1.5,
          }}
        >
          <strong style={{ fontWeight: 700 }}>You aren&apos;t on a team yet.</strong> Ask the
          commissioner to add your email ({email}) to a team and refresh.
        </div>
      )}

      {isAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          style={{
            width: '100%',
            marginTop: 14,
            background: 'var(--pdp-fairway)',
            color: 'var(--pdp-cream)',
            border: 'none',
            borderRadius: 16,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 6px 18px -10px rgba(27,67,50,0.6)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'rgba(244,239,227,0.15)',
              color: 'var(--pdp-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pencil size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Commissioner tools
            </div>
            <div
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 11.5,
                opacity: 0.75,
                marginTop: 1,
              }}
            >
              Weeks · Teams · Schedule · Scores · Course
            </div>
          </div>
          <div style={{ opacity: 0.7 }}>
            <Chevron size={16} />
          </div>
        </button>
      )}

      <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
        {[
          { label: 'Notifications', sub: 'Tee times, score reminders', Icon: Bell },
          { label: 'Past cards', sub: 'All weeks', Icon: Cal },
          { label: 'League rules', sub: 'Format, payouts, ties', Icon: Flag },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'var(--pdp-cream-soft)',
              border: '1px solid rgba(27,67,50,0.1)',
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: 'rgba(27,67,50,0.08)',
                color: 'var(--pdp-fairway)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <item.Icon size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'var(--pdp-ink)',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12,
                  color: 'var(--pdp-stone)',
                  marginTop: 1,
                }}
              >
                {item.sub}
              </div>
            </div>
            <div style={{ color: 'var(--pdp-fog)' }}>
              <Chevron size={16} />
            </div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSignOut}
        style={{
          width: '100%',
          marginTop: 18,
          padding: 12,
          background: 'transparent',
          border: '1px solid rgba(27,67,50,0.18)',
          borderRadius: 12,
          color: 'var(--pdp-stone)',
          cursor: 'pointer',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        Sign out
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          opacity: 0.65,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 20,
          fontWeight: 700,
          marginTop: 3,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function seasonRank(season: SeasonStanding[], teamId: number): number | string {
  const idx = season.findIndex((r) => r.team_id === teamId)
  return idx === -1 ? '—' : idx + 1
}
