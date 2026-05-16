'use client'

import { useEffect, useMemo, useState } from 'react'
import { TeamMark } from '../team-mark'
import { Chevron, ChevronDown, Minus, Plus, Check } from '../icons'
import { TeamPicker } from '../sheets/team-picker'
import type { CourseConfig, Team, Week } from '@/lib/pdp/types'

interface Props {
  week: Week
}

type Mode = 'hole' | 'total'

const DEFAULT_PARS = [4, 3, 5, 4, 4, 3, 4, 5, 4]
const DEFAULT_YARDS = [385, 175, 510, 410, 360, 195, 395, 525, 420]

export function SubmitScreen({ week }: Props) {
  const [teams, setTeams] = useState<Team[]>([])
  const [course, setCourse] = useState<CourseConfig>({
    name: 'Pine Dell Public',
    tees: 'white',
    holes: 9,
    pars: DEFAULT_PARS,
    yardages: DEFAULT_YARDS,
  })
  const [teamId, setTeamId] = useState<number | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [mode, setMode] = useState<Mode>('hole')
  const [holeIdx, setHoleIdx] = useState(0)
  const [p1Holes, setP1Holes] = useState<number[]>(() => DEFAULT_PARS.map(() => 0))
  const [p2Holes, setP2Holes] = useState<number[]>(() => DEFAULT_PARS.map(() => 0))
  const [p1Total, setP1Total] = useState(72)
  const [p2Total, setP2Total] = useState(75)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Team[]) => {
        if (Array.isArray(data)) {
          setTeams(data)
          if (data.length > 0 && teamId == null) setTeamId(data[0].id)
        }
      })
      .catch(() => {})
    fetch('/api/course-config')
      .then((r) => (r.ok ? r.json() : null))
      .then((c: CourseConfig | null) => {
        if (c?.pars?.length) {
          setCourse(c)
          setP1Holes(c.pars.map(() => 0))
          setP2Holes(c.pars.map(() => 0))
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const team = teams.find((t) => t.id === teamId) ?? null
  const pars = course.pars
  const parTotal = pars.reduce((a, b) => a + b, 0)

  const p1HoleSum = p1Holes.reduce((a, b) => a + (Number(b) || 0), 0)
  const p2HoleSum = p2Holes.reduce((a, b) => a + (Number(b) || 0), 0)
  const total = mode === 'hole' ? p1HoleSum + p2HoleSum : p1Total + p2Total
  const holesDone = useMemo(
    () => p1Holes.filter((h, i) => h > 0 && p2Holes[i] > 0).length,
    [p1Holes, p2Holes],
  )
  const canSubmit = team != null && (mode === 'total' || holesDone === pars.length)

  const setP1Hole = (i: number, v: number) =>
    setP1Holes((arr) => arr.map((x, idx) => (idx === i ? v : x)))
  const setP2Hole = (i: number, v: number) =>
    setP2Holes((arr) => arr.map((x, idx) => (idx === i ? v : x)))

  const handleSubmit = async () => {
    if (!canSubmit || !team) return
    setSubmitting(true)
    setErrorMsg('')
    try {
      const body =
        mode === 'hole'
          ? {
              week_id: week.id,
              team_id: team.id,
              player1_score: p1HoleSum,
              player2_score: p2HoleSum,
              player1_holes: p1Holes,
              player2_holes: p2Holes,
            }
          : {
              week_id: week.id,
              team_id: team.id,
              player1_score: p1Total,
              player2_score: p2Total,
            }
      const r = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        setErrorMsg(err.error ?? 'Failed to submit')
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2400)
      }
    } catch {
      setErrorMsg('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const date = new Date(week.start_date)
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div style={{ padding: '4px 20px 140px', position: 'relative' }}>
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 26,
            color: 'var(--pdp-ink)',
            lineHeight: 1.1,
          }}
        >
          Post your{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>scorecard</span>
        </div>
        <div
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 13,
            color: 'var(--pdp-stone)',
            marginTop: 4,
          }}
        >
          Week {week.week_number} · {dateLabel} · {pars.length} holes, {course.tees} tees
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowPicker(true)}
        disabled={teams.length === 0}
        style={{
          width: '100%',
          background: 'var(--pdp-cream-soft)',
          border: '1px solid rgba(27,67,50,0.12)',
          borderRadius: 16,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: teams.length === 0 ? 'wait' : 'pointer',
          textAlign: 'left',
        }}
      >
        {team ? (
          <>
            <TeamMark teamId={team.id} name={team.name} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--pdp-stone)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Your team
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'var(--pdp-ink)',
                  marginTop: 2,
                }}
              >
                {team.name}
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12,
                  color: 'var(--pdp-stone)',
                  marginTop: 1,
                }}
              >
                {team.player1_name} · {team.player2_name}
              </div>
            </div>
            <div style={{ color: 'var(--pdp-stone)' }}>
              <ChevronDown size={18} />
            </div>
          </>
        ) : (
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: 'var(--pdp-stone)' }}>
            Loading teams…
          </div>
        )}
      </button>

      <div
        style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
          background: 'rgba(27,67,50,0.07)',
          borderRadius: 12,
          padding: 4,
        }}
      >
        {(
          [
            { k: 'hole', label: 'By hole' },
            { k: 'total', label: 'Final total' },
          ] as Array<{ k: Mode; label: string }>
        ).map((o) => (
          <button
            key={o.k}
            type="button"
            onClick={() => setMode(o.k)}
            style={{
              padding: '8px 10px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              background: mode === o.k ? 'var(--pdp-cream-soft)' : 'transparent',
              color: mode === o.k ? 'var(--pdp-fairway)' : 'var(--pdp-stone)',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              boxShadow: mode === o.k ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 12,
          background: 'var(--pdp-cream-soft)',
          borderRadius: 18,
          border: '1px solid rgba(27,67,50,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'var(--pdp-fairway)',
            color: 'var(--pdp-cream)',
            padding: '10px 16px',
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
            Scorecard
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              opacity: 0.7,
            }}
          >
            WK {String(week.week_number).padStart(2, '0')} · PAR {parTotal} · {pars.length} HOLES
          </div>
        </div>

        {mode === 'total' ? (
          team ? (
            <>
              <TotalRow
                label="Player 1"
                name={team.player1_name}
                value={p1Total}
                onChange={setP1Total}
                par={parTotal}
              />
              <div style={{ borderTop: '1px dashed rgba(27,67,50,0.18)' }} />
              <TotalRow
                label="Player 2"
                name={team.player2_name}
                value={p2Total}
                onChange={setP2Total}
                par={parTotal}
              />
            </>
          ) : null
        ) : team ? (
          <HoleStepper
            holeIdx={holeIdx}
            setHoleIdx={setHoleIdx}
            team={team}
            pars={pars}
            yards={course.yardages}
            p1Holes={p1Holes}
            p2Holes={p2Holes}
            setP1Hole={setP1Hole}
            setP2Hole={setP2Hole}
          />
        ) : null}

        <div
          style={{
            padding: '14px 16px',
            background: 'rgba(27,67,50,0.05)',
            borderTop: '1px solid rgba(27,67,50,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--pdp-stone)',
              }}
            >
              Team total
            </div>
            <div
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 11,
                color: 'var(--pdp-stone)',
                marginTop: 2,
              }}
            >
              {mode === 'hole' && holesDone < pars.length
                ? `${holesDone}/${pars.length} holes`
                : `${total - parTotal * 2 >= 0 ? '+' : ''}${total - parTotal * 2} vs par`}
            </div>
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 38,
              fontWeight: 700,
              color: 'var(--pdp-fairway)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {total || '—'}
          </div>
        </div>
      </div>

      {mode === 'hole' && team && (
        <HoleOverview
          team={team}
          pars={pars}
          p1Holes={p1Holes}
          p2Holes={p2Holes}
          currentHole={holeIdx}
          onJump={setHoleIdx}
        />
      )}

      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 11.5,
          color: 'var(--pdp-stone)',
          marginTop: 12,
          marginLeft: 4,
          lineHeight: 1.5,
        }}
      >
        {mode === 'hole'
          ? 'Tap a hole to jump to it. Score saves when you submit.'
          : 'Quick mode for posting after the round. Switch to By hole to track stroke-by-stroke.'}
      </div>

      {errorMsg && (
        <div
          style={{
            marginTop: 12,
            padding: '10px 14px',
            background: 'rgba(179,54,54,0.08)',
            border: '1px solid rgba(179,54,54,0.25)',
            borderRadius: 12,
            color: 'var(--pdp-clay)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {errorMsg}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || success || !canSubmit}
        style={{
          width: '100%',
          marginTop: 16,
          height: 54,
          borderRadius: 16,
          background: success
            ? 'var(--pdp-fairway-bright)'
            : !canSubmit
              ? 'var(--pdp-stone)'
              : 'var(--pdp-fairway)',
          color: 'var(--pdp-cream)',
          border: 'none',
          cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '0.02em',
          opacity: !canSubmit && !success ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow:
            '0 8px 24px -8px rgba(27,67,50,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
          transition: 'all 0.2s',
        }}
      >
        {success ? (
          <>
            <Check size={20} /> Card submitted
          </>
        ) : submitting ? (
          'Posting card…'
        ) : !canSubmit && mode === 'hole' ? (
          `Finish all ${pars.length} holes (${holesDone}/${pars.length})`
        ) : (
          'Submit scorecard'
        )}
      </button>

      {showPicker && (
        <TeamPicker
          teams={teams}
          current={teamId}
          onPick={(id) => {
            setTeamId(id)
            setShowPicker(false)
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

function TotalRow({
  label,
  name,
  value,
  onChange,
  par,
}: {
  label: string
  name: string
  value: number
  onChange: (v: number) => void
  par: number
}) {
  const diff = value - par
  const diffLabel = diff === 0 ? 'E' : diff > 0 ? `+${diff}` : `${diff}`
  const diffColor = diff < 0 ? '#B33636' : diff > 0 ? 'var(--pdp-stone)' : 'var(--pdp-fairway)'

  return (
    <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--pdp-stone)',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--pdp-ink)',
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: diffColor,
            marginTop: 4,
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          {diffLabel} vs par
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} style={btnSquare(36)}>
          <Minus size={18} />
        </button>
        <input
          className="pdp-num"
          type="number"
          value={value}
          onChange={(e) =>
            onChange(Math.max(0, Math.min(150, Number(e.target.value) || 0)))
          }
          style={{
            width: 60,
            height: 56,
            borderRadius: 12,
            border: '1px solid rgba(27,67,50,0.15)',
            background: '#fff',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--pdp-fairway)',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            outline: 'none',
          }}
        />
        <button type="button" onClick={() => onChange(Math.min(150, value + 1))} style={btnSquare(36)}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}

function btnSquare(size: number): React.CSSProperties {
  return {
    width: size,
    height: size,
    borderRadius: 10,
    background: '#fff',
    border: '1px solid rgba(27,67,50,0.15)',
    color: 'var(--pdp-fairway)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}

interface StepperProps {
  holeIdx: number
  setHoleIdx: (i: number) => void
  team: Team
  pars: number[]
  yards: number[]
  p1Holes: number[]
  p2Holes: number[]
  setP1Hole: (i: number, v: number) => void
  setP2Hole: (i: number, v: number) => void
}

function HoleStepper({
  holeIdx,
  setHoleIdx,
  team,
  pars,
  yards,
  p1Holes,
  p2Holes,
  setP1Hole,
  setP2Hole,
}: StepperProps) {
  const par = pars[holeIdx]
  const yds = yards[holeIdx]
  const p1 = p1Holes[holeIdx]
  const p2 = p2Holes[holeIdx]

  const next = () => {
    if (p1 === 0) setP1Hole(holeIdx, par)
    if (p2 === 0) setP2Hole(holeIdx, par)
    if (holeIdx < pars.length - 1) setHoleIdx(holeIdx + 1)
  }

  return (
    <div style={{ padding: '14px 16px 4px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <button
          type="button"
          onClick={() => setHoleIdx(Math.max(0, holeIdx - 1))}
          disabled={holeIdx === 0}
          style={{
            ...btnSquare(36),
            opacity: holeIdx === 0 ? 0.35 : 1,
            transform: 'rotate(180deg)',
          }}
        >
          <Chevron size={18} />
        </button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'var(--pdp-stone)',
            }}
          >
            Hole {holeIdx + 1} of {pars.length}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: 8,
              marginTop: 2,
            }}
          >
            <div
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontSize: 30,
                color: 'var(--pdp-fairway)',
                lineHeight: 1,
              }}
            >
              Par {par}
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: 'var(--pdp-stone)',
              }}
            >
              {yds} yd
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={next}
          disabled={holeIdx === pars.length - 1}
          style={{
            ...btnSquare(36),
            background: holeIdx === pars.length - 1 ? '#fff' : 'var(--pdp-fairway)',
            color: holeIdx === pars.length - 1 ? 'var(--pdp-fairway)' : 'var(--pdp-cream)',
            opacity: holeIdx === pars.length - 1 ? 0.35 : 1,
          }}
        >
          <Chevron size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <PlayerHoleTile
          name={team.player1_name}
          label="P1"
          value={p1}
          par={par}
          onChange={(v) => setP1Hole(holeIdx, v)}
        />
        <PlayerHoleTile
          name={team.player2_name}
          label="P2"
          value={p2}
          par={par}
          onChange={(v) => setP2Hole(holeIdx, v)}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          padding: '14px 0 8px',
        }}
      >
        {pars.map((_, i) => {
          const done = p1Holes[i] > 0 && p2Holes[i] > 0
          const cur = i === holeIdx
          return (
            <button
              key={i}
              type="button"
              onClick={() => setHoleIdx(i)}
              style={{
                width: cur ? 22 : 8,
                height: 8,
                borderRadius: 8,
                border: 'none',
                background: cur
                  ? 'var(--pdp-fairway)'
                  : done
                    ? 'rgba(27,67,50,0.55)'
                    : 'rgba(27,67,50,0.18)',
                cursor: 'pointer',
                transition: 'all 0.18s',
                padding: 0,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function PlayerHoleTile({
  name,
  label,
  value,
  par,
  onChange,
}: {
  name: string
  label: string
  value: number
  par: number
  onChange: (v: number) => void
}) {
  const diff = value > 0 ? value - par : 0
  const diffLabel =
    value === 0
      ? '—'
      : diff === 0
        ? 'Par'
        : diff === -1
          ? 'Birdie'
          : diff === -2
            ? 'Eagle'
            : diff === -3
              ? 'Albatross'
              : diff === 1
                ? 'Bogey'
                : diff === 2
                  ? 'Double'
                  : diff > 0
                    ? `+${diff}`
                    : `${diff}`
  const diffColor =
    value === 0
      ? 'var(--pdp-fog)'
      : diff < 0
        ? 'var(--pdp-clay)'
        : diff === 0
          ? 'var(--pdp-fairway)'
          : diff <= 1
            ? 'var(--pdp-stone)'
            : '#8B5A3C'

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid rgba(27,67,50,0.15)',
        padding: '12px 12px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'var(--pdp-stone)',
          marginBottom: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--pdp-ink)',
          marginBottom: 8,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {name.split(' ')[0]}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          style={{ ...btnSquare(30), borderRadius: 8 }}
        >
          <Minus size={16} />
        </button>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: value === 0 ? 'rgba(27,67,50,0.04)' : 'var(--pdp-cream-soft)',
            border: '1.5px solid ' + (value === 0 ? 'rgba(27,67,50,0.15)' : 'var(--pdp-fairway)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--pdp-fairway)',
            letterSpacing: '-0.03em',
          }}
        >
          {value || ''}
        </div>
        <button
          type="button"
          onClick={() => onChange(value === 0 ? par : value + 1)}
          style={{ ...btnSquare(30), borderRadius: 8 }}
        >
          <Plus size={16} />
        </button>
      </div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 11,
          color: diffColor,
          marginTop: 8,
          fontWeight: 600,
        }}
      >
        {diffLabel}
      </div>
    </div>
  )
}

function HoleOverview({
  team,
  pars,
  p1Holes,
  p2Holes,
  currentHole,
  onJump,
}: {
  team: Team
  pars: number[]
  p1Holes: number[]
  p2Holes: number[]
  currentHole: number
  onJump: (i: number) => void
}) {
  const totalPar = pars.reduce((a, b) => a + b, 0)
  const p1Tot = p1Holes.reduce((a, b) => a + b, 0)
  const p2Tot = p2Holes.reduce((a, b) => a + b, 0)
  const cols = `38px repeat(${pars.length}, 1fr) 40px`

  const cellBg = (value: number, par: number, isCurrent: boolean) => {
    if (!value) return isCurrent ? 'rgba(201,146,74,0.08)' : 'transparent'
    const diff = value - par
    if (diff < 0) return 'rgba(179,54,54,0.12)'
    if (diff === 0) return 'rgba(27,67,50,0.08)'
    if (diff === 1) return 'transparent'
    return 'rgba(110,104,87,0.1)'
  }

  return (
    <div
      style={{
        marginTop: 14,
        background: 'var(--pdp-cream-soft)',
        border: '1px solid rgba(27,67,50,0.12)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '8px 14px',
          background: 'rgba(27,67,50,0.05)',
          borderBottom: '1px solid rgba(27,67,50,0.08)',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--pdp-stone)',
        }}
      >
        Round overview
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: cols }}>
        <Hdr text="H" />
        {pars.map((_, i) => (
          <Hdr key={i} text={String(i + 1)} highlight={i === currentHole} />
        ))}
        <Hdr text="Σ" />

        <Hdr text="par" />
        {pars.map((p, i) => (
          <Mid key={i} text={String(p)} highlight={i === currentHole} />
        ))}
        <Mid text={String(totalPar)} bold />

        <Hdr text={team.player1_name.split(' ')[0].slice(0, 4)} />
        {p1Holes.map((v, i) => (
          <button
            type="button"
            key={i}
            onClick={() => onJump(i)}
            style={{
              height: 30,
              minWidth: 0,
              border: 'none',
              cursor: 'pointer',
              background: cellBg(v, pars[i], i === currentHole),
              color: v ? 'var(--pdp-ink)' : 'var(--pdp-fog)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13,
              fontWeight: 600,
              padding: 0,
              borderLeft: i === currentHole ? '2px solid var(--pdp-sand)' : 'none',
              borderRight: i === currentHole ? '2px solid var(--pdp-sand)' : 'none',
            }}
          >
            {v || '·'}
          </button>
        ))}
        <Total value={p1Tot} />

        <Hdr text={team.player2_name.split(' ')[0].slice(0, 4)} />
        {p2Holes.map((v, i) => (
          <button
            type="button"
            key={i}
            onClick={() => onJump(i)}
            style={{
              height: 30,
              minWidth: 0,
              border: 'none',
              cursor: 'pointer',
              background: cellBg(v, pars[i], i === currentHole),
              color: v ? 'var(--pdp-ink)' : 'var(--pdp-fog)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13,
              fontWeight: 600,
              padding: 0,
              borderLeft: i === currentHole ? '2px solid var(--pdp-sand)' : 'none',
              borderRight: i === currentHole ? '2px solid var(--pdp-sand)' : 'none',
            }}
          >
            {v || '·'}
          </button>
        ))}
        <Total value={p2Tot} />
      </div>
    </div>
  )
}

function Hdr({ text, highlight = false }: { text: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        fontFamily:
          /^\d+$/.test(text) ? '"JetBrains Mono", monospace' : 'Manrope, sans-serif',
        fontSize: /^\d+$/.test(text) ? 11 : 9,
        fontWeight: 600,
        letterSpacing: /^\d+$/.test(text) ? 'normal' : '0.1em',
        color: highlight ? 'var(--pdp-fairway)' : 'var(--pdp-stone)',
        textTransform: 'uppercase',
        background: highlight ? 'rgba(201,146,74,0.15)' : 'rgba(27,67,50,0.04)',
        borderLeft: highlight ? '2px solid var(--pdp-sand)' : 'none',
        borderRight: highlight ? '2px solid var(--pdp-sand)' : 'none',
      }}
    >
      {text}
    </div>
  )
}

function Mid({ text, highlight = false, bold = false }: { text: string; highlight?: boolean; bold?: boolean }) {
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
        background: highlight ? 'rgba(201,146,74,0.08)' : 'transparent',
        borderLeft: highlight ? '2px solid rgba(201,146,74,0.6)' : 'none',
        borderRight: highlight ? '2px solid rgba(201,146,74,0.6)' : 'none',
      }}
    >
      {text}
    </div>
  )
}

function Total({ value }: { value: number }) {
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
