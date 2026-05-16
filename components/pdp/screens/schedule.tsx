'use client'

import { useEffect, useState } from 'react'
import { TeamMark } from '../team-mark'
import type { Match, Week } from '@/lib/pdp/types'

interface Props {
  week: Week
}

export function ScheduleScreen({ week }: Props) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/schedule/${week.id}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setMatches(Array.isArray(data) ? data : [])
      })
      .catch(() => !cancelled && setMatches([]))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [week.id])

  const date = new Date(week.start_date)
  const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' })
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div style={{ padding: '4px 20px 120px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 26,
              color: 'var(--pdp-ink)',
              lineHeight: 1.1,
            }}
          >
            Round {week.week_number}{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>tee sheet</span>
          </div>
          <div
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 13,
              color: 'var(--pdp-stone)',
              marginTop: 4,
            }}
          >
            {dayLabel}, {dateLabel} · Pine Dell Public
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--pdp-cream-soft)',
          borderRadius: 20,
          padding: '4px 0',
          border: '1px solid rgba(27,67,50,0.1)',
          overflow: 'hidden',
          boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 8px 20px -10px rgba(27,67,50,0.18)',
          minHeight: 120,
        }}
      >
        {loading && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--pdp-stone)', fontSize: 13 }}>
            Loading tee sheet…
          </div>
        )}
        {!loading && matches.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--pdp-stone)', fontSize: 13 }}>
            No matchups scheduled for this week.
          </div>
        )}
        {matches.map((m, i) => (
          <div
            key={m.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '74px 1fr',
              alignItems: 'stretch',
              borderBottom:
                i < matches.length - 1 ? '1px solid rgba(27,67,50,0.08)' : 'none',
            }}
          >
            <div
              style={{
                padding: '16px 0 16px 16px',
                borderRight: '1px dashed rgba(27,67,50,0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--pdp-fairway)',
                  letterSpacing: '-0.02em',
                }}
              >
                {m.tee_time.replace(' PM', '').replace(' AM', '')}
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 10,
                  color: 'var(--pdp-stone)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                }}
              >
                Tee {i + 1}
              </div>
            </div>
            <div
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TeamMark teamId={m.team1_id} name={m.team1_name} size={28} />
                <div
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: 15,
                    color: 'var(--pdp-ink)',
                  }}
                >
                  {m.team1_name}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  paddingLeft: 12,
                  color: 'var(--pdp-fog)',
                }}
              >
                <div
                  style={{ width: 6, height: 6, borderRadius: 6, background: 'var(--pdp-sand)' }}
                />
                <div
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontStyle: 'italic',
                    fontSize: 13,
                  }}
                >
                  vs
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TeamMark teamId={m.team2_id} name={m.team2_name} size={28} />
                <div
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: 15,
                    color: 'var(--pdp-ink)',
                  }}
                >
                  {m.team2_name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
