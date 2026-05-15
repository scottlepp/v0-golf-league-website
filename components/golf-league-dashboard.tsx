import { Suspense } from 'react'
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

async function fetchWeeks(): Promise<Week[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/weeks`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!response.ok) throw new Error(`Failed to fetch weeks: ${response.status}`)
    return response.json()
  } catch (error) {
    console.error('Error fetching weeks:', error)
    // Return default weeks
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      week_number: i + 1,
      start_date: new Date(2026, 4, 15 + i * 7).toISOString(),
      is_current: i === 0,
      is_completed: false,
    }))
  }
}

export default async function GolfLeagueDashboard() {
  const weeks = await fetchWeeks()
  const currentWeek = weeks.find((w) => w.is_current) || weeks[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-900">PDP Golf League</h1>
          <p className="text-lg text-muted-foreground">
            {currentWeek
              ? `Week ${currentWeek.week_number} — 12 Teams | 12 Weeks`
              : '12 Teams | 12 Weeks'}
          </p>
        </div>

        {/* Week Selector */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="font-semibold text-gray-700">Select Week:</span>
          <WeekSelectorClient weeks={weeks} defaultWeek={currentWeek?.week_number || 1} />
        </div>

        {/* Main Content */}
        <div className="rounded-lg bg-white shadow-lg p-6">
          <TabsWrapper selectedWeek={currentWeek?.week_number || 1} />
        </div>
      </div>
    </div>
  )
}

function TabsWrapper({ selectedWeek }: { selectedWeek: number }) {
  return (
    <Tabs defaultValue="schedule" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="schedule">League Schedule</TabsTrigger>
        <TabsTrigger value="standings">Standings</TabsTrigger>
        <TabsTrigger value="scores">Submit Scores</TabsTrigger>
      </TabsList>

      {/* League Schedule Tab */}
      <TabsContent value="schedule" className="space-y-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">League Schedule</h2>
          <p className="text-gray-600">Week {selectedWeek} matchups and tee times</p>
        </div>
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse" />}>
          <LeagueSchedule weekId={selectedWeek} />
        </Suspense>
      </TabsContent>

      {/* Standings Tab */}
      <TabsContent value="standings" className="space-y-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Weekly Standings</h2>
          <p className="text-gray-600">Week {selectedWeek} team rankings and scores</p>
        </div>
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse" />}>
          <Standings weekId={selectedWeek} />
        </Suspense>
      </TabsContent>

      {/* Submit Scores Tab */}
      <TabsContent value="scores" className="space-y-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Submit Scores</h2>
          <p className="text-gray-600">Enter your team's scores for Week {selectedWeek}</p>
        </div>
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded animate-pulse" />}>
          <ScoreSubmissionForm weekId={selectedWeek} />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}
