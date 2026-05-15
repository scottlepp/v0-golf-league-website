'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import WeekSelector from './week-selector'
import LeagueSchedule from './league-schedule'
import Standings from './standings'
import ScoreSubmissionForm from './score-submission-form'

interface Week {
  id: number
  week_number: number
  start_date: string
  is_current: boolean
  is_completed: boolean
}

export default function GolfLeagueDashboard() {
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [weeks, setWeeks] = useState<Week[]>([])
  const [scheduleData, setScheduleData] = useState<any[]>([])
  const [standingsData, setStandingsData] = useState<any[]>([])
  const [scheduleLoading, setScheduleLoading] = useState(true)
  const [standingsLoading, setStandingsLoading] = useState(true)
  const [submitMessage, setSubmitMessage] = useState('')

  // Fetch weeks once on mount
  useEffect(() => {
    fetch('/api/weeks')
      .then((r) => r.json())
      .then((data) => {
        setWeeks(data)
        const current = data.find((w: Week) => w.is_current)
        if (current) setSelectedWeek(current.week_number)
      })
      .catch(console.error)
  }, [])

  // Fetch schedule whenever selected week changes
  const fetchSchedule = useCallback(() => {
    setScheduleLoading(true)
    fetch(`/api/schedule/${selectedWeek}`)
      .then((r) => r.json())
      .then((data) => setScheduleData(data))
      .catch(console.error)
      .finally(() => setScheduleLoading(false))
  }, [selectedWeek])

  // Fetch standings whenever selected week changes
  const fetchStandings = useCallback(() => {
    setStandingsLoading(true)
    fetch(`/api/standings/${selectedWeek}`)
      .then((r) => r.json())
      .then((data) => setStandingsData(data))
      .catch(console.error)
      .finally(() => setStandingsLoading(false))
  }, [selectedWeek])

  useEffect(() => {
    fetchSchedule()
    fetchStandings()
  }, [fetchSchedule, fetchStandings])

  const currentWeek = weeks.find((w) => w.is_current)

  const handleScoresSubmitted = () => {
    fetchSchedule()
    fetchStandings()
    setSubmitMessage('Scores submitted successfully!')
    setTimeout(() => setSubmitMessage(''), 4000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PDP Golf League</h1>
          <p className="text-lg text-gray-600">
            {currentWeek
              ? `Week ${currentWeek.week_number} — 12 Teams | 12 Weeks`
              : '12 Teams | 12 Weeks'}
          </p>
        </div>

        {/* Week Selector */}
        <div className="mb-6">
          <WeekSelector
            weeks={weeks}
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
            currentWeek={currentWeek?.week_number}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="schedule">League Schedule</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="submit">Submit Scores</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <LeagueSchedule
              schedule={scheduleData}
              weekNumber={selectedWeek}
              isLoading={scheduleLoading}
            />
          </TabsContent>

          <TabsContent value="standings">
            <Standings
              standings={standingsData}
              weekNumber={selectedWeek}
              isLoading={standingsLoading}
            />
          </TabsContent>

          <TabsContent value="submit">
            <ScoreSubmissionForm
              weekId={selectedWeek}
              onSuccess={handleScoresSubmitted}
              submitMessage={submitMessage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
