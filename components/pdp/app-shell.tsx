'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { Header } from './header'
import { WeekStrip } from './week-strip'
import { BottomNav, type TabId } from './bottom-nav'
import { ScheduleScreen } from './screens/schedule'
import { StandingsScreen } from './screens/standings'
import { SubmitScreen } from './screens/submit'
import { MeScreen } from './screens/me'
import { useSwipe } from '@/lib/pdp/hooks'
import type { Week } from '@/lib/pdp/types'

interface Props {
  email: string
  isAdmin: boolean
}

const FALLBACK_WEEKS: Week[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  week_number: i + 1,
  start_date: new Date(2026, 4, 16 + i * 7).toISOString(),
  is_current: i === 0,
  is_completed: false,
}))

export function AppShell({ email, isAdmin }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<TabId>('schedule')
  const [weeks, setWeeks] = useState<Week[]>(FALLBACK_WEEKS)
  const [selectedWeek, setSelectedWeek] = useState(1)

  useEffect(() => {
    fetch('/api/weeks')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Week[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setWeeks(data)
          const current = data.find((w) => w.is_current) ?? data[0]
          setSelectedWeek(current.week_number)
        }
      })
      .catch(() => {})
  }, [])

  const current = weeks.find((w) => w.week_number === selectedWeek) ?? weeks[0]

  const swipeable = tab === 'schedule' || tab === 'standings'
  const swipe = useSwipe(
    () =>
      swipeable &&
      setSelectedWeek((w) => Math.min(weeks[weeks.length - 1]?.week_number ?? 12, w + 1)),
    () => swipeable && setSelectedWeek((w) => Math.max(weeks[0]?.week_number ?? 1, w - 1)),
  )

  const onSignOut = async () => {
    try {
      await authClient.signOut()
    } catch {
      // ignore
    }
    router.refresh()
    router.push('/auth/sign-in')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--pdp-cream)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          minHeight: '100vh',
          background: 'var(--pdp-cream)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          position: 'relative',
        }}
      >
        <div {...swipe}>
          <Header />
          {(tab === 'schedule' || tab === 'standings' || tab === 'submit') && (
            <div style={{ marginBottom: 14 }}>
              <WeekStrip
                weeks={weeks}
                selectedWeekNumber={selectedWeek}
                onSelect={setSelectedWeek}
              />
            </div>
          )}
          {tab === 'schedule' && <ScheduleScreen week={current} />}
          {tab === 'standings' && <StandingsScreen week={current} />}
          {tab === 'submit' && <SubmitScreen week={current} />}
          {tab === 'me' && (
            <MeScreen
              email={email}
              isAdmin={isAdmin}
              onOpenAdmin={() => router.push('/admin')}
              onSignOut={onSignOut}
            />
          )}
        </div>
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
