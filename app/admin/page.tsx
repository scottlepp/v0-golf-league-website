import Link from 'next/link'

export default function AdminHome() {
  const sections = [
    { href: '/admin/weeks', title: 'Weeks', desc: 'Mark current and completed weeks.', count: '12' },
    { href: '/admin/teams', title: 'Teams', desc: 'Create, edit, delete, assign player emails.', count: '12' },
    { href: '/admin/schedule', title: 'Schedule', desc: 'Edit matchups and tee times.', count: '6/wk' },
    { href: '/admin/scores', title: 'Scores', desc: 'Edit or delete submitted scores.', count: 'live' },
    { href: '/admin/course', title: 'Course', desc: 'Par and yardage per hole.', count: 'Par 36' },
  ]

  return (
    <div>
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 32,
          color: 'var(--pdp-ink)',
          lineHeight: 1.1,
          marginBottom: 6,
        }}
      >
        Commissioner <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>tools</span>
      </div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 13,
          color: 'var(--pdp-stone)',
          marginBottom: 24,
        }}
      >
        Edits here are immediate and live for all members.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
        }}
      >
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '18px 18px',
              background: 'var(--pdp-cream-soft)',
              border: '1px solid rgba(27,67,50,0.12)',
              borderRadius: 18,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'var(--pdp-fairway)',
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12.5,
                  color: 'var(--pdp-stone)',
                  marginTop: 4,
                }}
              >
                {s.desc}
              </div>
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--pdp-fairway)',
                background: 'rgba(27,67,50,0.08)',
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              {s.count}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
