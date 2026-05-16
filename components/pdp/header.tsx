'use client'

import { Bell } from './icons'

export function Header() {
  return (
    <div style={{ padding: '8px 20px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div
            style={{
              fontFamily: '"Instrument Serif", serif',
              fontSize: 32,
              lineHeight: 1,
              color: 'var(--pdp-fairway)',
              letterSpacing: '-0.01em',
            }}
          >
            PDP <span style={{ fontStyle: 'italic', opacity: 0.85 }}>Golf League</span>
          </div>
          <div
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 11,
              color: 'var(--pdp-stone)',
              marginTop: 4,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Season 2026 · 12 Teams · 12 Weeks
          </div>
        </div>
        <button
          type="button"
          style={{
            width: 38,
            height: 38,
            borderRadius: 38,
            background: 'rgba(27,67,50,0.08)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--pdp-fairway)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Bell size={18} />
        </button>
      </div>
    </div>
  )
}
