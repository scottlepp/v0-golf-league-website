'use client'

import { useEffect, useState } from 'react'
import { TeamMark } from '../team-mark'
import { GolfBall } from '../icons'
import { ScorecardDetailSheet } from '../sheets/scorecard-detail'
import type { Standing, Week, SeasonStanding } from '@/lib/pdp/types'

interface Props {
  week: Week
}

type Mode = 'week' | 'season'

export function StandingsScreen({ week }: Props) {
  const [mode, setMode] = useState<Mode>('week')
  const [weekRows, setWeekRows] = useState<Standing[]>([])
  const [seasonRows, setSeasonRows] = useState<SeasonStanding[]>([])
  const [loading, setLoading] = useState(true)
  const [openTeamId, setOpenTeamId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const url = mode === 'season' ? '/api/standings/season' : `/api/standings/${week.id}`
    fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled) return
        if (mode === 'season') setSeasonRows(Array.isArray(data) ? data : [])
        else setWeekRows(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (cancelled) return
        if (mode === 'season') setSeasonRows([])
        else setWeekRows([])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [mode, week.id])

  const hasData = mode === 'season' ? seasonRows.length > 0 : weekRows.length > 0
  const podium = mode === 'season' ? seasonRows.slice(0, 3) : weekRows.slice(0, 3)
  const rest = mode === 'season' ? seasonRows.slice(3) : weekRows.slice(3)

  return (
    <div style={{ padding: '4px 20px 120px' }}>
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 26,
          color: 'var(--pdp-ink)',
          lineHeight: 1.1,
          marginBottom: 12,
        }}
      >
        {mode === 'season' ? (
          <>
            Season{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>leaderboard</span>
          </>
        ) : (
          <>
            Week {week.week_number}{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>results</span>
          </>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
          background: 'rgba(27,67,50,0.07)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 18,
        }}
      >
        {(['week', 'season'] as Mode[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            style={{
              padding: '8px 10px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              background: mode === k ? 'var(--pdp-cream-soft)' : 'transparent',
              color: mode === k ? 'var(--pdp-fairway)' : 'var(--pdp-stone)',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              boxShadow: mode === k ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {k === 'week' ? 'This Week' : 'Season'}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          style={{
            background: 'var(--pdp-cream-soft)',
            borderRadius: 22,
            padding: '40px 24px',
            textAlign: 'center',
            color: 'var(--pdp-stone)',
            fontSize: 13,
          }}
        >
          Loading…
        </div>
      ) : !hasData ? (
        <EmptyStandings week={week} />
      ) : (
        <>
          <Podium
            rows={podium}
            mode={mode}
            onTap={mode === 'week' ? (id) => setOpenTeamId(id) : undefined}
          />
          {rest.length > 0 && (
            <div
              style={{
                marginTop: 14,
                background: 'var(--pdp-cream-soft)',
                border: '1px solid rgba(27,67,50,0.1)',
                borderRadius: 18,
                overflow: 'hidden',
              }}
            >
              {rest.map((r, i) => (
                <StandingsRow
                  key={mode === 'season' ? (r as SeasonStanding).team_id : (r as Standing).team_id}
                  row={r}
                  mode={mode}
                  rank={i + 4}
                  last={i === rest.length - 1}
                  onTap={
                    mode === 'week'
                      ? () => setOpenTeamId((r as Standing).team_id)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {openTeamId !== null && (
        <ScorecardDetailSheet
          weekId={week.id}
          weekNumber={week.week_number}
          teamId={openTeamId}
          onClose={() => setOpenTeamId(null)}
        />
      )}
    </div>
  )
}

function Podium({
  rows,
  mode,
  onTap,
}: {
  rows: (Standing | SeasonStanding)[]
  mode: Mode
  onTap?: (teamId: number) => void
}) {
  const medalColors = ['#D4A574', '#B9B9B9', '#C28B5B']
  // visual order: 2nd, 1st (tallest), 3rd
  const order = [1, 0, 2].filter((i) => rows[i])

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #1B4332 0%, #143527 100%)',
        borderRadius: 22,
        padding: '20px 16px 18px',
        color: 'var(--pdp-cream)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="podium-hatch" patternUnits="userSpaceOnUse" width="6" height="6">
            <path d="M0 6L6 0" stroke="#F4EFE3" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#podium-hatch)" />
      </svg>

      <div
        style={{
          position: 'relative',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          opacity: 0.65,
          fontWeight: 600,
          marginBottom: 14,
        }}
      >
        {mode === 'season' ? 'Top of the Field' : 'Leaders'}
      </div>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        {order.map((rankIdx) => {
          const r = rows[rankIdx]
          const isFirst = rankIdx === 0
          const h = rankIdx === 0 ? 130 : rankIdx === 1 ? 100 : 84
          const teamId =
            mode === 'season' ? (r as SeasonStanding).team_id : (r as Standing).team_id
          const teamName =
            mode === 'season' ? (r as SeasonStanding).team_name : (r as Standing).team_name
          const big =
            mode === 'season'
              ? (r as SeasonStanding).points
              : (r as Standing).total_score ?? 0

          return (
            <button
              type="button"
              key={teamId}
              onClick={() => onTap?.(teamId)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: onTap ? 'pointer' : 'default',
                color: 'var(--pdp-cream)',
              }}
            >
              <TeamMark teamId={teamId} name={teamName} size={isFirst ? 48 : 40} />
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: isFirst ? 13 : 12,
                  color: 'var(--pdp-cream)',
                  textAlign: 'center',
                  lineHeight: 1.15,
                  maxWidth: '100%',
                }}
              >
                {teamName}
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: isFirst ? 22 : 18,
                  fontWeight: 600,
                  color: 'var(--pdp-cream)',
                  letterSpacing: '-0.02em',
                }}
              >
                {big}
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                  marginTop: -4,
                }}
              >
                {mode === 'season' ? 'PTS' : 'STROKES'}
              </div>
              <div
                style={{
                  width: '100%',
                  height: h,
                  background: `linear-gradient(180deg, ${medalColors[rankIdx]} 0%, ${medalColors[rankIdx]}cc 100%)`,
                  borderRadius: '10px 10px 0 0',
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: 8,
                  fontFamily: '"Instrument Serif", serif',
                  fontSize: 28,
                  color: 'var(--pdp-fairway)',
                  fontWeight: 400,
                  boxShadow:
                    'inset 0 -2px 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                {rankIdx + 1}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StandingsRow({
  row,
  mode,
  rank,
  last,
  onTap,
}: {
  row: Standing | SeasonStanding
  mode: Mode
  rank: number
  last: boolean
  onTap?: () => void
}) {
  const teamId = mode === 'season' ? (row as SeasonStanding).team_id : (row as Standing).team_id
  const teamName =
    mode === 'season' ? (row as SeasonStanding).team_name : (row as Standing).team_name
  const total =
    mode === 'season'
      ? (row as SeasonStanding).avg_score
      : (row as Standing).total_score ?? 0
  const points =
    mode === 'season' ? (row as SeasonStanding).points : (row as Standing).points_earned

  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        width: '100%',
        textAlign: 'left',
        display: 'grid',
        gridTemplateColumns: '32px 1fr auto auto',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        border: 'none',
        background: 'transparent',
        cursor: onTap ? 'pointer' : 'default',
        borderBottom: last ? 'none' : '1px solid rgba(27,67,50,0.08)',
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 14,
          color: 'var(--pdp-stone)',
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        {rank}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <TeamMark teamId={teamId} name={teamName} size={30} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--pdp-ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {teamName}
          </div>
          <div
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 11,
              color: 'var(--pdp-stone)',
              marginTop: 2,
            }}
          >
            {mode === 'season' ? `avg ${total}` : `total ${total}`}
          </div>
        </div>
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--pdp-ink)',
          minWidth: 36,
          textAlign: 'right',
        }}
      >
        {total}
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--pdp-fairway)',
          minWidth: 30,
          textAlign: 'right',
          padding: '3px 8px',
          background: 'rgba(27,67,50,0.08)',
          borderRadius: 8,
        }}
      >
        {points}
        {mode === 'season' ? '' : 'p'}
      </div>
    </button>
  )
}

function EmptyStandings({ week }: { week: Week }) {
  return (
    <div
      style={{
        background: 'var(--pdp-cream-soft)',
        borderRadius: 22,
        padding: '40px 24px',
        textAlign: 'center',
        border: '1px dashed rgba(27,67,50,0.2)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          color: 'var(--pdp-fairway)',
          opacity: 0.6,
          marginBottom: 12,
        }}
      >
        <GolfBall size={36} />
      </div>
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 22,
          color: 'var(--pdp-ink)',
          lineHeight: 1.2,
        }}
      >
        No cards posted{' '}
        <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>yet</span>
      </div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 13,
          color: 'var(--pdp-stone)',
          marginTop: 6,
          maxWidth: 240,
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.5,
        }}
      >
        Week {week.week_number} scores will appear here as teams submit their cards.
      </div>
    </div>
  )
}
