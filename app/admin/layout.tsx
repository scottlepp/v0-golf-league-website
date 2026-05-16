import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireAdmin()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--pdp-cream)' }}>
      <header
        style={{
          background: 'var(--pdp-cream-soft)',
          borderBottom: '1px solid rgba(27,67,50,0.1)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Link
              href="/admin"
              style={{
                fontFamily: '"Instrument Serif", serif',
                fontSize: 22,
                color: 'var(--pdp-fairway)',
                letterSpacing: '-0.01em',
                textDecoration: 'none',
              }}
            >
              PDP <span style={{ fontStyle: 'italic', opacity: 0.85 }}>Admin</span>
            </Link>
            <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { href: '/admin/weeks', label: 'Weeks' },
                { href: '/admin/teams', label: 'Teams' },
                { href: '/admin/schedule', label: 'Schedule' },
                { href: '/admin/scores', label: 'Scores' },
                { href: '/admin/course', label: 'Course' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--pdp-fairway)',
                    padding: '6px 10px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    background: 'rgba(27,67,50,0.06)',
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--pdp-stone)' }}>{session.user?.email}</span>
            <Link
              href="/"
              style={{
                color: 'var(--pdp-fairway)',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: 8,
                background: 'rgba(27,67,50,0.06)',
              }}
            >
              ← Back to app
            </Link>
          </div>
        </div>
      </header>
      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '24px 20px 60px',
        }}
      >
        {children}
      </main>
    </div>
  )
}
