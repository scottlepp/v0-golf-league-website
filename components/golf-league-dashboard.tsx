'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LeagueSchedule from './league-schedule'
import Standings from './standings'
import ScoreSubmissionForm from './score-submission-form'
import WeekSelectorClient from './week-selector-client'

interface Week {
  id: number
  week_number: number
  start_date: string
  is_current: boolean
  is_completed: boolean
}

const FALLBACK_WEEKS: Week[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  week_number: i + 1,
  start_date: new Date(2026, 4, 15 + i * 7).toISOString(),
  is_current: i === 0,
  is_completed: false,
}))

export default function GolfLeagueDashboard() {
  const [weeks, setWeeks] = useState<Week[]>(FALLBACK_WEEKS)
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [submitMessage, setSubmitMessage] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetch('/api/weeks')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch weeks: ${r.status}`)
        return r.json()
      })
      .then((data: Week[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setWeeks(data)
          const current = data.find((w) => w.is_current) || data[0]
          setSelectedWeek(current.week_number)
        }
      })
      .catch((err) => {
        console.error('Error fetching weeks:', err)
      })
  }, [])

  const currentWeek = weeks.find((w) => w.week_number === selectedWeek) || weeks[0]
  const selectedWeekId = currentWeek?.id ?? selectedWeek

  const handleScoreSuccess = () => {
    setSubmitMessage('Scores submitted successfully!')
    setRefreshKey((k) => k + 1)
    setTimeout(() => setSubmitMessage(''), 4000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-900">PDP Golf League</h1>
          <p className="text-lg text-muted-foreground">
            {currentWeek
              ? `Week ${currentWeek.week_number} — 12 Teams | 12 Weeks`
              : '12 Teams | 12 Weeks'}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="font-semibold text-gray-700">Select Week:</span>
          <WeekSelectorClient
            weeks={weeks}
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />
        </div>

        <div className="rounded-lg bg-white shadow-lg p-6">
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="schedule">League Schedule</TabsTrigger>
              <TabsTrigger value="standings">Standings</TabsTrigger>
              <TabsTrigger value="scores">Submit Scores</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <LeagueSchedule
                weekId={selectedWeekId}
                weekNumber={selectedWeek}
              />
            </TabsContent>

            <TabsContent value="standings" className="space-y-4">
              <Standings
                key={`standings-${refreshKey}`}
                weekId={selectedWeekId}
                weekNumber={selectedWeek}
              />
            </TabsContent>

            <TabsContent value="scores" className="space-y-4">
              <ScoreSubmissionForm
                weekId={selectedWeekId}
                onSuccess={handleScoreSuccess}
                submitMessage={submitMessage}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
