'use client'

import { useEffect, useRef } from 'react'
import type { Week } from '@/lib/pdp/types'

interface Props {
  weeks: Week[]
  selectedWeekNumber: number
  onSelect: (weekNumber: number) => void
}

export function WeekStrip({ weeks, selectedWeekNumber, onSelect }: Props) {
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(
      `[data-week="${selectedWeekNumber}"]`,
    )
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [selectedWeekNumber])

  return (
    <div
      ref={stripRef}
      className="pdp-strip"
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        padding: '0 20px 4px',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {weeks.map((w) => {
        const active = w.week_number === selectedWeekNumber
        const date = new Date(w.start_date)
        const dateLabel = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        return (
          <button
            type="button"
            key={w.id}
            data-week={w.week_number}
            onClick={() => onSelect(w.week_number)}
            style={{
              flexShrink: 0,
              minWidth: 64,
              padding: '10px 14px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              background: active
                ? 'var(--pdp-fairway)'
                : w.is_completed
                  ? 'rgba(27,67,50,0.06)'
                  : 'rgba(0,0,0,0.03)',
              color: active
                ? 'var(--pdp-cream)'
                : w.is_completed
                  ? 'var(--pdp-fairway)'
                  : 'var(--pdp-stone)',
              fontFamily: 'Manrope, sans-serif',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.12em',
                opacity: active ? 0.75 : 0.6,
                textTransform: 'uppercase',
              }}
            >
              WK
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: '"JetBrains Mono", monospace',
                lineHeight: 1,
              }}
            >
              {String(w.week_number).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>{dateLabel}</div>
            {w.is_current && !active && (
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 6,
                  height: 6,
                  borderRadius: 6,
                  background: 'var(--pdp-sand)',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
