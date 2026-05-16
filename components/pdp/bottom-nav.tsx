'use client'

import { Flag, Trophy, Pencil, User } from './icons'

export type TabId = 'schedule' | 'standings' | 'submit' | 'me'

const TABS: Array<{ id: TabId; label: string; Icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'schedule', label: 'Schedule', Icon: Flag },
  { id: 'standings', label: 'Standings', Icon: Trophy },
  { id: 'submit', label: 'Submit', Icon: Pencil },
  { id: 'me', label: 'Me', Icon: User },
]

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        paddingTop: 6,
        background:
          'linear-gradient(180deg, rgba(244,239,227,0) 0%, rgba(244,239,227,0.92) 30%, rgba(244,239,227,1) 60%)',
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      <div
        style={{
          margin: '0 14px',
          maxWidth: 480,
          marginInline: 'auto',
          pointerEvents: 'auto',
          background: 'rgba(251,247,236,0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(27,67,50,0.1)',
          borderRadius: 22,
          padding: 6,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4,
          boxShadow:
            '0 10px 30px -10px rgba(27,67,50,0.25), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              style={{
                border: 'none',
                background: isActive ? 'var(--pdp-fairway)' : 'transparent',
                color: isActive ? 'var(--pdp-cream)' : 'var(--pdp-fairway)',
                borderRadius: 16,
                padding: '8px 4px 7px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <div style={{ opacity: isActive ? 1 : 0.85 }}>
                <Icon size={20} />
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
