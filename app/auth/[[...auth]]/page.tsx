import { AuthView } from '@neondatabase/auth-ui'

export const dynamic = 'force-dynamic'

export default async function AuthPage({
  params,
}: {
  params: Promise<{ auth?: string[] }>
}) {
  const { auth: segments = ['sign-in'] } = await params
  const path = segments.join('/')

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F4EFE3 0%, #EDE5D0 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 40px)',
        paddingBottom: 60,
        paddingInline: 20,
      }}
    >
      <svg
        width="100%"
        height="220"
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.08, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="auth-hatch" patternUnits="userSpaceOnUse" width="6" height="6">
            <path d="M0 6L6 0" stroke="#1B4332" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-hatch)" />
      </svg>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px 6px 10px',
            background: 'var(--pdp-fairway)',
            borderRadius: 999,
            color: 'var(--pdp-cream)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          PDP Golf · 2026
        </div>

        <div
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 44,
            lineHeight: 1.02,
            color: 'var(--pdp-fairway)',
            marginTop: 22,
            letterSpacing: '-0.01em',
          }}
        >
          Welcome to the <span style={{ fontStyle: 'italic' }}>course</span>.
        </div>
        <div
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 14,
            color: 'var(--pdp-stone)',
            marginTop: 10,
            lineHeight: 1.45,
            maxWidth: 320,
          }}
        >
          Sign in to post scores, see standings, and check your tee time.
        </div>

        <div
          style={{
            marginTop: 28,
            background: 'var(--pdp-cream-soft)',
            border: '1px solid rgba(27,67,50,0.12)',
            borderRadius: 22,
            padding: 16,
            boxShadow: '0 14px 36px -16px rgba(27,67,50,0.3)',
          }}
        >
          <AuthView path={path} />
        </div>

        <div
          style={{
            marginTop: 18,
            fontFamily: 'Manrope, sans-serif',
            fontSize: 11,
            color: 'var(--pdp-stone)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          New to the league? Ask the commissioner to add you to a team.
        </div>
      </div>
    </div>
  )
}
