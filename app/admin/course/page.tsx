import sql from '@/lib/db'
import { updateCourse } from './actions'

export const dynamic = 'force-dynamic'

interface CourseRow {
  name: string
  tees: string
  holes: number
  pars: number[]
  yardages: number[]
}

const DEFAULT: CourseRow = {
  name: 'Pine Dell Public',
  tees: 'white',
  holes: 9,
  pars: [4, 3, 5, 4, 4, 3, 4, 5, 4],
  yardages: [385, 175, 510, 410, 360, 195, 395, 525, 420],
}

export default async function CourseAdminPage() {
  const rows = (await sql`
    SELECT name, tees, holes, pars, yardages FROM course_config WHERE id = 1
  `) as unknown as CourseRow[]
  const course = rows[0] ?? DEFAULT
  const parTotal = course.pars.reduce((a, b) => a + b, 0)
  const ydTotal = course.yardages.reduce((a, b) => a + b, 0)

  return (
    <div>
      <div
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 24,
          color: 'var(--pdp-ink)',
          marginBottom: 4,
        }}
      >
        Edit <span style={{ fontStyle: 'italic', color: 'var(--pdp-stone)' }}>course</span>
      </div>
      <div
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 13,
          color: 'var(--pdp-stone)',
          marginBottom: 18,
        }}
      >
        Par {parTotal} · {ydTotal.toLocaleString()} yd · {course.holes} holes
      </div>

      <form
        action={updateCourse}
        style={{
          background: 'var(--pdp-cream-soft)',
          border: '1px solid rgba(27,67,50,0.12)',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <Field label="Course name">
            <input name="name" defaultValue={course.name} required style={inputStyle} />
          </Field>
          <Field label="Tees">
            <input name="tees" defaultValue={course.tees} required style={inputStyle} />
          </Field>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 1fr',
            gap: 10,
            alignItems: 'center',
            padding: '8px 12px',
            background: 'rgba(27,67,50,0.05)',
            borderRadius: 10,
            fontFamily: 'Manrope, sans-serif',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--pdp-stone)',
          }}
        >
          <div>Hole</div>
          <div>Par</div>
          <div>Yardage</div>
        </div>

        {course.pars.map((par, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 1fr',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--pdp-fairway)',
              }}
            >
              {i + 1}
            </div>
            <input
              type="number"
              name={`par_${i}`}
              defaultValue={par}
              min={3}
              max={6}
              required
              style={{ ...inputStyle, fontFamily: '"JetBrains Mono", monospace' }}
            />
            <input
              type="number"
              name={`yard_${i}`}
              defaultValue={course.yardages[i] ?? 0}
              min={50}
              max={700}
              required
              style={{ ...inputStyle, fontFamily: '"JetBrains Mono", monospace' }}
            />
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
          <button type="submit" style={btnPrimary}>
            Save course
          </button>
          <div
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              color: 'var(--pdp-stone)',
            }}
          >
            Changes affect submitted cards going forward; past per-hole detail is preserved.
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontFamily: 'Manrope, sans-serif',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: 'var(--pdp-stone)',
        textTransform: 'uppercase',
      }}
    >
      {label}
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  height: 36,
  padding: '0 10px',
  borderRadius: 8,
  border: '1px solid rgba(27,67,50,0.18)',
  background: '#fff',
  fontFamily: 'Manrope, sans-serif',
  fontSize: 13,
  color: 'var(--pdp-ink)',
  outline: 'none',
  textTransform: 'none',
  letterSpacing: 'normal',
  fontWeight: 500,
}

const btnPrimary: React.CSSProperties = {
  height: 36,
  padding: '0 16px',
  background: 'var(--pdp-fairway)',
  color: 'var(--pdp-cream)',
  border: 'none',
  borderRadius: 10,
  fontFamily: 'Manrope, sans-serif',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}
