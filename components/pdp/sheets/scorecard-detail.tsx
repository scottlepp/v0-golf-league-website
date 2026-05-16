'use client'

import { useEffect, useState } from 'react'
import { TeamMark } from '../team-mark'
import type { CourseConfig } from '@/lib/pdp/types'

interface Props {
  weekId: number
  weekNumber: number
  teamId: number
  onClose: () => void
}

interface ScoreData {
  submission: {
    id: number
    player1_score: number
    player2_score: number
    total_score: number
  } | null
  holes: Array<{ hole_number: number; player_index: number; strokes: number }>
}

interface TeamLite {
  id: number
  name: string
  player1_name: string
  player2_name: string
}

const DEFAULT_PARS = [4, 3, 5, 4, 4, 3, 4, 5, 4]

export function ScorecardDetailSheet({ weekId, weekNumber, teamId, onClose }: Props) {
  const [course, setCourse] = useState<CourseConfig | null>(null)
  const [team, setTeam] = useState<TeamLite | null>(null)
  const [data, setData] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      fetch('/api/teams').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/course-config').then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/score-holes/${weekId}/${teamId}`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([teams, courseData, scoreData]) => {
        if (cancelled) return
        setTeam(Array.isArray(teams) ? teams.find((t: TeamLite) => t.id === teamId) ?? null : null)
        setCourse(courseData)
        setData(scoreData)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [weekId, teamId])

  const pars = course?.pars ?? DEFAULT_PARS
  const parTotal = pars.reduce((a, b) => a + b, 0)

  const p1Holes: number[] = pars.map((_, i) => {
    const found = data?.holes.find((h) => h.hole_number === i + 1 && h.player_index === 1)
    return found?.strokes ?? 0
  })
  const p2Holes: number[] = pars.map((_, i) => {
    const found = data?.holes.find((h) => h.hole_number === i + 1 && h.player_index === 2)
    return found?.strokes ?? 0
  })
  const hasHoles = data?.holes.length ? data.holes.length > 0 : false

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        onClick={onClose}
        className="pdp-fade-in"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.32)',
          pointerEvents: 'auto',
        }}
      />
      <div
        className="pdp-slide-up"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'var(--pdp-cream)',
          borderRadius: '24px 24px 0 0',
          padding: '12px 0 28px',
          pointerEvents: 'auto',
          maxHeight: '82vh',
          overflowY: 'auto',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 4,
            background: 'rgba(0,0,0,0.18)',
            margin: '0 auto 12px',
          }}
        />

        {loading || !team || !data?.submission ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--pdp-stone)', fontSize: 13 }}>
            {loading ? 'Loading scorecard…' : 'No card posted yet.'}
          </div>
        ) : (
          <>
            <div
              style={{
                padding: '0 20px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <TeamMark teamId={team.id} name={team.name} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: 'var(--pdp-stone)',
                  }}
                >
                  Week {weekNumber} · {team.name}
                </div>
                <div
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    fontSize: 22,
                    color: 'var(--pdp-ink)',
                    lineHeight: 1.1,
                    marginTop: 2,
                  }}
                >
                  {team.player1_name}{' '}
                  <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>&amp;</span>{' '}
                  {team.player2_name}
                </div>
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 30,
                  fontWeight: 700,
                  color: 'var(--pdp-fairway)',
                  letterSpacing: '-0.03em',
                }}
              >
                {data.submission.total_score}
              </div>
            </div>

            {!hasHoles ? (
              <div
                style={{
                  margin: '0 16px',
                  background: 'var(--pdp-cream-soft)',
                  border: '1px solid rgba(27,67,50,0.12)',
                  borderRadius: 14,
                  padding: '20px 16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                <PlayerTotal label={team.player1_name} value={data.submission.player1_score} />
                <PlayerTotal label={team.player2_name} value={data.submission.player2_score} />
                <div
                  style={{
                    gridColumn: '1 / -1',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 11,
                    color: 'var(--pdp-stone)',
                    textAlign: 'center',
                  }}
                >
                  Per-hole detail not recorded for this card.
                </div>
              </div>
            ) : (
              <ScoreGrid
                pars={pars}
                parTotal={parTotal}
                p1Holes={p1Holes}
                p2Holes={p2Holes}
                p1Total={data.submission.player1_score}
                p2Total={data.submission.player2_score}
                p1Name={team.player1_name}
                p2Name={team.player2_name}
              />
            )}

            <div
              style={{
                margin: '14px 16px 0',
                padding: '12px 14px',
                background: 'rgba(27,67,50,0.05)',
                borderRadius: 12,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 8,
              }}
            >
              <MiniStat label="Strokes" value={data.submission.total_score} />
              <MiniStat label="vs Par" value={signed(data.submission.total_score - parTotal * 2)} />
              <MiniStat label="Per player" value={Math.round(data.submission.total_score / 2)} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function signed(n: number) {
  return (n >= 0 ? '+' : '') + n
}

function PlayerTotal({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'var(--pdp-stone)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--pdp-fairway)',
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--pdp-stone)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--pdp-fairway)',
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  )
}

interface GridProps {
  pars: number[]
  parTotal: number
  p1Holes: number[]
  p2Holes: number[]
  p1Total: number
  p2Total: number
  p1Name: string
  p2Name: string
}

function ScoreGrid({
  pars,
  parTotal,
  p1Holes,
  p2Holes,
  p1Total,
  p2Total,
  p1Name,
  p2Name,
}: GridProps) {
  return (
    <div
      style={{
        margin: '0 16px',
        background: 'var(--pdp-cream-soft)',
        border: '1px solid rgba(27,67,50,0.12)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'var(--pdp-fairway)',
          color: 'var(--pdp-cream)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
            opacity: 0.7,
          }}
        >
          Card
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            opacity: 0.7,
          }}
        >
          {pars.length} HOLES · PAR {parTotal}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `40px repeat(${pars.length}, 1fr) 40px`,
          alignItems: 'stretch',
        }}
      >
        <Lbl text="H" />
        {pars.map((_, i) => (
          <CellHeader key={i} text={`${i + 1}`} />
        ))}
        <CellHeader text="Σ" />

        <Lbl text="par" />
        {pars.map((p, i) => (
          <CellMuted key={i} text={String(p)} />
        ))}
        <CellMuted text={String(parTotal)} bold />

        <Lbl text={p1Name.split(' ')[0].slice(0, 4)} />
        {p1Holes.map((v, i) => (
          <HoleCell key={i} value={v} par={pars[i]} />
        ))}
        <CellTotal value={p1Total} />

        <Lbl text={p2Name.split(' ')[0].slice(0, 4)} />
        {p2Holes.map((v, i) => (
          <HoleCell key={i} value={v} par={pars[i]} />
        ))}
        <CellTotal value={p2Total} />
      </div>
    </div>
  )
}

function HoleCell({ value, par }: { value: number; par: number }) {
  const diff = value > 0 ? value - par : 0
  const isEagle = value > 0 && diff <= -2
  const isBirdie = diff === -1
  const isPar = value > 0 && diff === 0
  const isBogey = diff === 1
  const isDouble = diff >= 2
  const ring = isBirdie ? '2px solid #B33636' : isEagle ? '2px double #B33636' : 'none'
  const box = isBogey ? '2px solid #6E6857' : isDouble ? '2px solid #1F1F1F' : 'none'
  const isCircle = isBirdie || isEagle
  return (
    <div
      style={{
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid rgba(27,67,50,0.08)',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13,
          fontWeight: 700,
          color: !value ? 'var(--pdp-fog)' : isPar ? 'var(--pdp-fairway)' : 'var(--pdp-ink)',
          borderRadius: isCircle ? 24 : 0,
          border: isCircle ? ring : box,
        }}
      >
        {value || '·'}
      </div>
    </div>
  )
}

function Lbl({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Manrope, sans-serif',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: 'var(--pdp-stone)',
        background: 'rgba(27,67,50,0.04)',
      }}
    >
      {text}
    </div>
  )
}

function CellHeader({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 26,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--pdp-stone)',
        background: 'rgba(27,67,50,0.04)',
      }}
    >
      {text}
    </div>
  )
}

function CellMuted({ text, bold = false }: { text: string; bold?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 26,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 12,
        fontWeight: bold ? 700 : 400,
        color: 'var(--pdp-stone)',
        borderTop: '1px solid rgba(27,67,50,0.08)',
      }}
    >
      {text}
    </div>
  )
}

function CellTotal({ value }: { value: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--pdp-fairway)',
        borderTop: '1px solid rgba(27,67,50,0.08)',
      }}
    >
      {value || '—'}
    </div>
  )
}
