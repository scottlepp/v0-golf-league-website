'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import WeekSelector from './week-selector'
import LeagueSchedule from './league-schedule'
import Standings from './standings'
import ScoreSubmissionForm from './score-submission-form'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function GolfLeagueDashboard() {
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const { data: weeks } = useSWR('/api/weeks', fetcher)
  const { data: scheduleData, mutate: mutateSchedule } = useSWR(
    selectedWeek ? `/api/schedule/${selectedWeek}` : null,
    fetcher
  )
  const { data: standingsData, mutate: mutateStandings } = useSWR(
    selectedWeek ? `/api/standings/${selectedWeek}` : null,
    fetcher
  )

  const currentWeek = weeks?.find((w: any) => w.is_current)

  const handleScoresSubmitted = () => {
    mutateSchedule()
    mutateStandings()
    setIsSubmitting(false)
    setSubmitMessage('Scores submitted successfully!')
    setTimeout(() => setSubmitMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PDP Golf League</h1>
          <p className="text-lg text-gray-600">
            {currentWeek && `Week ${currentWeek.week_number} - 12 Teams | 12 Weeks`}
          </p>
        </div>

        {/* Week Selector */}
        <div className="mb-6">
          <WeekSelector
            weeks={weeks || []}
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

          {/* League Schedule Tab */}
          <TabsContent value="schedule">
            <LeagueSchedule
              schedule={scheduleData || []}
              weekNumber={selectedWeek}
              isLoading={!scheduleData}
            />
          </TabsContent>

          {/* Standings Tab */}
          <TabsContent value="standings">
            <Standings
              standings={standingsData || []}
              weekNumber={selectedWeek}
              isLoading={!standingsData}
            />
          </TabsContent>

          {/* Submit Scores Tab */}
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
