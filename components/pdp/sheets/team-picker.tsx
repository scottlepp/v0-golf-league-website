'use client'

import { TeamMark } from '../team-mark'
import { Check } from '../icons'
import type { Team } from '@/lib/pdp/types'

interface Props {
  teams: Team[]
  current: number | null
  onPick: (id: number) => void
  onClose: () => void
}

export function TeamPicker({ teams, current, onPick, onClose }: Props) {
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
          maxHeight: '78vh',
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
            margin: '0 auto 14px',
          }}
        />
        <div
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 22,
            color: 'var(--pdp-ink)',
            padding: '0 20px 4px',
          }}
        >
          Pick your <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>team</span>
        </div>
        <div
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            color: 'var(--pdp-stone)',
            padding: '0 20px 14px',
          }}
        >
          {teams.length} teams in the league
        </div>
        <div style={{ padding: '0 12px' }}>
          {teams.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onPick(t.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                background: current === t.id ? 'rgba(27,67,50,0.08)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 12,
                textAlign: 'left',
              }}
            >
              <TeamMark teamId={t.id} name={t.name} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--pdp-ink)',
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 12,
                    color: 'var(--pdp-stone)',
                    marginTop: 1,
                  }}
                >
                  {t.player1_name} · {t.player2_name}
                </div>
              </div>
              {current === t.id && (
                <div style={{ color: 'var(--pdp-fairway)' }}>
                  <Check size={20} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
